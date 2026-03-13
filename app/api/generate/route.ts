export const maxDuration = 60;
import { VertexAI, SchemaType } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";
import { buildGenerationPrompt } from "../../../lib/prompts";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import path from "path";

// ==========================================
// 🛡️ THE TITANIUM PEM RECONSTRUCTOR
// ==========================================
// This completely bypasses Vercel's environment variable formatting bugs.
function buildFlawlessPrivateKey(brokenKey: string): string {
  // 1. Strip headers, footers, and any accidental quotes
  let purePayload = brokenKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/"/g, '');

  // 2. Strip ALL noise: spaces, literal newlines, escaped newlines, carriage returns
  purePayload = purePayload.replace(/\\n/g, '').replace(/[\s\r\n]/g, '');

  // 3. Mathematically rebuild the key exactly how OpenSSL demands (64 chars per line)
  const chunks = purePayload.match(/.{1,64}/g)?.join('\n') || '';

  // 4. Reattach the headers with explicit, perfect line breaks
  return `-----BEGIN PRIVATE KEY-----\n${chunks}\n-----END PRIVATE KEY-----\n`;
}

// ==========================================
// 1. INITIALIZE SECURITY LAYER (UPSTASH)
// ==========================================
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true, 
});

const distributionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    campaign: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.INTEGER },
          x: { type: SchemaType.STRING },
          linkedin: { type: SchemaType.STRING },
          discord: { type: SchemaType.STRING }
        },
        required: ["day", "x", "linkedin", "discord"]
      }
    }
  },
  required: ["campaign"]
};

// ==========================================
// 3. MAIN API CONTROLLER
// ==========================================
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

    if (!success) {
      return NextResponse.json(
        { error: "You have exceeded your rate limit. Please try again in an hour." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        }
      );
    }

    const formData = await req.formData();
    const urlContext = formData.get("urlContext") as string | null;
    const textContext = formData.get("textContext") as string | null;
    const tweetFormat = formData.get("tweetFormat") as string || "single";
    const personaVoice = formData.get("personaVoice") as string || "Expert Content Strategist";
    const file = formData.get("file") as File | null;

    const textPrompt = buildGenerationPrompt({
      tweetFormat,
      personaVoice,
      textContext,
      urlContext,
    });

    const parts: any[] = [{ text: textPrompt }];

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");
      parts.push({ inlineData: { data: base64Data, mimeType: file.type } });
    }


    // ⚡ THE BASE64 FILE BYPASS
    let authOptions = {};

    if (process.env.GOOGLE_BASE64_JSON) {
      // PROD: Decode the pristine Base64 string back into a perfect JSON object
      const decodedJsonString = Buffer.from(process.env.GOOGLE_BASE64_JSON, 'base64').toString('utf-8');
      const gcpCredentials = JSON.parse(decodedJsonString);
      
      authOptions = {
        credentials: {
          client_email: gcpCredentials.client_email,
          private_key: gcpCredentials.private_key,
        },
      };
    } else {
      // LOCAL: Fallback to the local file if the env var isn't present
      authOptions = {
        keyFilename: path.join(process.cwd(), "gcp-service-account.json"),
      };
    }

    const vertex_ai = new VertexAI({
      project: "ozigi-489021", 
      location: "us-central1",
      googleAuthOptions: authOptions,
    });

    const model = vertex_ai.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: distributionSchema,
      }
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: parts }],
    });

    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return NextResponse.json({ output: responseText });

  } catch (err: any) {
    console.error("🔥 VERTEX AI CRASH:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}