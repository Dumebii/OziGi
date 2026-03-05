import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, userId, imageUrl } = await req.json();
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Fetch LinkedIn Access Token (Supabase usually stores the provider profile id here too)
    const { data: tokenData, error: tokenError } = await supabase
      .from("user_tokens")
      .select("access_token, provider_id")
      .eq("user_id", userId)
      .eq("provider", "linkedin")
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: "LinkedIn not connected." },
        { status: 401 }
      );
    }

    const linkedInToken = tokenData.access_token;
    // LinkedIn requires the user's URN to post. Supabase usually stores the provider ID.
    const authorUrn = `urn:li:person:${tokenData.provider_id}`;

    let assetUrn: string | undefined = undefined;

    // ✨ The 3-Step Image Handshake
    if (imageUrl) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Step 1: Register the Upload
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

      // Step 2: Upload the binary data
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { Authorization: `Bearer ${linkedInToken}` },
        body: imageBuffer,
      });
    }

    // ✨ Step 3: Create the Post
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

    if (!postRes.ok) throw new Error("LinkedIn rejected the post");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("LinkedIn API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
