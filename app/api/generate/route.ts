export const maxDuration = 60; // ✨ Tells Vercel to wait up to 60 seconds for Vertex AI to finish!
import { VertexAI, SchemaType } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";
import { buildGenerationPrompt } from "../../../lib/prompts";

// 1. Define the strict JSON Schema
// This physically prevents the model from returning conversational pre-text or malformed data
const distributionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    campaign: {
      type: SchemaType.ARRAY,
      description: "A list of 3 daily social media posts.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { 
            type: SchemaType.INTEGER, 
            description: "The day number in the sequence (1, 2, or 3)" 
          },
          x: { 
            type: SchemaType.STRING, 
            description: "Content for X/Twitter. Must match the requested single/thread format." 
          },
          linkedin: { 
            type: SchemaType.STRING, 
            description: "Content for LinkedIn." 
          },
          discord: { 
            type: SchemaType.STRING, 
            description: "Content for Discord." 
          }
        },
        required: ["day", "x", "linkedin", "discord"]
      }
    }
  },
  required: ["campaign"]
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const urlContext = formData.get("urlContext") as string | null;
    const textContext = formData.get("textContext") as string | null;
    const tweetFormat = formData.get("tweetFormat") as string || "single";
    const personaVoice = formData.get("personaVoice") as string || "Expert Content Strategist";
    const file = formData.get("file") as File | null;

    // ✨ Generate the prompt using our clean utility function
    const textPrompt = buildGenerationPrompt({
      tweetFormat,
      personaVoice,
      textContext,
      urlContext,
    });

    // 2. Array of "parts" strictly required by the Vertex AI SDK
    const parts: any[] = [{ text: textPrompt }];

    // Handle Image/PDF Uploads
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");

      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    }

    // 3. Initialize Enterprise Vertex AI
    const vertex_ai = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID as string,
      location: "us-central1",
      googleAuthOptions: {
        credentials: {
          client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL?.replace(/"/g, ''),
          private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY
            ?.replace(/\\n/g, "\n")
            ?.replace(/"/g, ""),
        },
      },
    });

    // 4. ✨ Attach the Schema to the Model Configuration
    const model = vertex_ai.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: distributionSchema,
      }
    });

    // 5. Fire the properly formatted enterprise request
    const result = await model.generateContent({
      contents: [{ role: "user", parts: parts }],
    });

    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ output: responseText });
  } catch (error: any) {
    console.error("Vertex AI Generate Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}