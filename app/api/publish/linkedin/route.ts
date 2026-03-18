import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, userId, imageUrl, accessToken: providedToken } = await req.json();
    const authHeader = req.headers.get("Authorization");

    let linkedInToken: string | null = null;

    // If a token is provided in the body, use it directly
    if (providedToken) {
      linkedInToken = providedToken;
    } 
    // Otherwise, fall back to database lookup using the user session
    else if (authHeader && userId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: authHeader } } }
      );

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data: tokenData, error: tokenError } = await supabase
        .from("user_tokens")
        .select("access_token")
        .eq("user_id", userId)
        .in("provider", ["linkedin", "linkedin_oidc"])
        .maybeSingle();

      if (tokenError || !tokenData) {
        return NextResponse.json(
          { error: `Database failed to find token: ${tokenError?.message || "No row found."}` },
          { status: 401 }
        );
      }
      linkedInToken = tokenData.access_token;
    } else {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    if (!linkedInToken) {
      return NextResponse.json({ error: "Empty oauth2 access token" }, { status: 401 });
    }

    // Fetch user's LinkedIn profile to get author URN
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${linkedInToken}` },
    });

    if (!profileRes.ok) {
      throw new Error("Failed to authenticate token with LinkedIn.");
    }

    const profileData = await profileRes.json();
    const authorUrn = `urn:li:person:${profileData.sub}`;

    let assetUrn: string | undefined = undefined;

    // Image upload logic (same as before)
    if (imageUrl) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      const registerRes = await fetch(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${linkedInToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registerUploadRequest: {
              recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
              owner: authorUrn,
              serviceRelationships: [
                {
                  relationshipType: "OWNER",
                  identifier: "urn:li:userGeneratedContent",
                },
              ],
            },
          }),
        }
      );

      const registerData = await registerRes.json();
      const uploadUrl =
        registerData.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
      assetUrn = registerData.value.asset;

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/octet-stream" },
        body: imageBuffer,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error("Image Upload Failed:", errorText);
        throw new Error("Failed to upload the image file to LinkedIn's server.");
      }

      // Wait for LinkedIn to process the image
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }

    // Create the post
    const postPayload: any = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: text },
          shareMediaCategory: assetUrn ? "IMAGE" : "NONE",
          media: assetUrn ? [{ status: "READY", media: assetUrn }] : [],
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    const postRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${linkedInToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(postPayload),
    });

    const postResult = await postRes.json();

    // Increment stats – use a service role client to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await supabaseAdmin.rpc("increment_posts_published", { user_id_input: userId });

    if (!postRes.ok) throw new Error(postResult.message || "LinkedIn rejected the post");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("LinkedIn API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}