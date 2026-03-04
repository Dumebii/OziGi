import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, platform } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }

    const cleanText = text
      .replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
      .substring(0, 150);
    const prompt = `A clean, modern, professional conceptual graphic representing: "${cleanText}". Suitable for a ${platform} post. No text or words in the image. High quality, aesthetic, vibrant.`;

    // ✨ UPGRADE: Hitting the newer -002 endpoint which is often available to paid tiers
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "16:9",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Google Imagen API rejected the request."
      );
    }

    const base64Image = data.predictions[0].bytesBase64Encoded;
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
