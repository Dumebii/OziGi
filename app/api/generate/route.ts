import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { articleUrl } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // FIX: Changed response_mime_type to responseMimeType
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      Analyze this technical article: ${articleUrl}
      Generate a 3-day social media strategy. 
      Return ONLY a JSON object with this structure:
      {"campaign": [{"day": 1, "x": "content", "linkedin": "content", "discord": "content"}]}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean any accidental markdown wrap
    const cleanJson = text.replace(/```json|```/g, "").trim();

    return NextResponse.json({ output: cleanJson });
  } catch (error: any) {
    console.error("SERVER ERROR:", error.message);
    // Always return JSON to prevent the "Unexpected token E" error on the frontend
    return NextResponse.json(
      {
        output: JSON.stringify({ campaign: [] }),
        error: error.message,
      },
      { status: 500 }
    );
  }
}
