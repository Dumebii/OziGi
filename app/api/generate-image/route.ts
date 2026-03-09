import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Extract the new graphicTitle from the payload
    const { text, platform, graphicTitle } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    let prompt = "";
    let negativePrompt = "";

    // 2. The Prompt Switcher (Upgraded for "Highly Cracked CTO" performance)
    if (graphicTitle && graphicTitle.trim() !== "") {
      // MODE A: Precision Typography (This was already working well)
      prompt = `A clean, modern, professional graphic. In the center, prominently featuring the exact text "${graphicTitle.trim()}" written in bold, highly legible, stylish modern typography. The background is a vibrant, minimalist conceptual design representing the theme of the text. Suitable for a ${platform} post. High resolution, professional design.`;
      negativePrompt =
        "spelling mistakes, typos, gibberish, messy fonts, unreadable text, extra letters, alien text, unreadable words";
    } else {
      // ✨ MODE B: Ironclad Abstract (Vastly Upgraded suppression)
      const cleanText = text
        .replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
        .substring(0, 150);

      // We are moving the prompt to be purely about geometry, light, and color
      prompt = `A sleek, professional, purely abstract conceptual graphic. Modern aesthetic with clean geometric shapes, harmonious vibrant color palette, high-tech gradients, and glowing data points. Highly conceptual minimalism, octane render quality. Suitable for a ${platform} post. High resolution, detailed textures, cinematic lighting. It does NOT contain any text.`;

      // ✨ The Expanded "Zero Text" Negative Prompt
      // This mathematically banishes all forms of letters, words, and even text-like scribbles
      negativePrompt =
        "text, words, letters, characters, script, calligraphy, handwriting, alphabet, typography, watermark, signature, writing, scribble, squiggles, gibberish, alien text, unreadable text, messy text, messy fonts, number, figures, blurbs, titles, labels, captions, paragraphs, layout with text, text-boxes, placeholders for text, extra letters, misspelled words, extra words, blurred text";
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
            negativePrompt: negativePrompt, // ✨ Pass our upgraded dynamic shield
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
