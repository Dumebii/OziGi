import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✨ 1. Extract the new graphicTitle from the payload
    const { text, platform, graphicTitle } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    let prompt = "";
    let negativePrompt = "";

    // ✨ 2. The Prompt Switcher
    if (graphicTitle && graphicTitle.trim() !== "") {
      // MODE A: Precision Typography
      prompt = `A clean, modern, professional graphic. In the center, prominently featuring the exact text "${graphicTitle.trim()}" written in bold, highly legible, stylish modern typography. The background is a vibrant, minimalist conceptual design representing the theme of the text. Suitable for a ${platform} post.`;
      negativePrompt =
        "spelling mistakes, typos, gibberish, messy fonts, unreadable text, extra letters";
    } else {
      // MODE B: Ironclad Abstract (No Text allowed!)
      const cleanText = text
        .replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
        .substring(0, 150);
      prompt = `A clean, modern, professional abstract conceptual graphic representing the core theme of: "${cleanText}". Suitable for a ${platform} post. High quality, aesthetic, vibrant minimalist illustration.`;
      // The negative prompt mathematically subtracts these elements from the pixel map
      negativePrompt =
        "text, words, letters, typography, watermark, signature, writing, alphabet, fonts, gibberish, labels";
    }

    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = "us-central1";

    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      projectId: projectId,
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    if (!accessToken?.token) {
      throw new Error("Failed to generate Google Cloud access token.");
    }

    const response = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-002:predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.token}`,
        },
        body: JSON.stringify({
          instances: [{ prompt: prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "16:9",
            negativePrompt: negativePrompt, // ✨ Pass our dynamic shield
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Vertex AI rejected the request.");
    }

    const base64Image = data.predictions[0].bytesBase64Encoded;
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("Vertex AI Image Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
