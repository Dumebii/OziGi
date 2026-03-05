import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function POST(req: Request) {
  try {
    // ✨ Added imageUrl to the payload extraction
    const { text, userId, imageUrl } = await req.json();
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !userId) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // ✨ Added access_secret to the query. Twitter requires BOTH to upload media!
    const { data: tokenData, error: tokenError } = await supabase
      .from("user_tokens")
      .select("access_token, access_secret")
      .eq("user_id", userId)
      .in("provider", ["twitter", "x"])
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: "X account not connected. Please sign in with X again." },
        { status: 401 }
      );
    }

    // ✨ Initialize the Twitter Client with App Keys AND User Tokens
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: tokenData.access_token,
      accessSecret: tokenData.access_secret || "",
    });

    const tweets = text.split("\n\n").filter((t: string) => t.trim() !== "");
    let mediaId: string | undefined = undefined;

    // ✨ The Image Upload Handshake
    if (imageUrl) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Upload to X's media server
      mediaId = await twitterClient.v1.uploadMedia(imageBuffer, {
        mimeType: "image/jpeg",
      });
    }

    let previousTweetId: string | undefined = undefined;

    // Loop through and post them.
    for (let i = 0; i < tweets.length; i++) {
      const isFirstTweet = i === 0;
      const payload: any = { text: tweets[i] };

      // Threading logic
      if (previousTweetId) {
        payload.reply = { in_reply_to_tweet_id: previousTweetId };
      }

      // ✨ Attach the image ONLY to the first tweet in the thread
      if (isFirstTweet && mediaId) {
        payload.media = { media_ids: [mediaId] };
      }

      // Fire the tweet using the v2 client
      const response = await twitterClient.v2.tweet(payload);

      // Save the ID so the next tweet knows what to reply to
      previousTweetId = response.data.id;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("X Publish API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
