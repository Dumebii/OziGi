import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

// Catch people trying to visit the API directly in their browser
export async function GET(request: Request) {
  return NextResponse.redirect(new URL('/', request.url));
}

export async function POST(req: Request) {
  try {
    const { urlContext, textContext, personaVoice } = await req.json();

    let finalContext = "";

    // 1. Process URL if provided (Using Jina AI Proxy to bypass blocks)
    if (urlContext && urlContext.trim() !== "") {
      const targetUrl = `https://r.jina.ai/${urlContext}`;
      
      const urlResponse = await fetch(targetUrl, {
        headers: {
          "Accept": "text/event-stream", // Jina prefers this for markdown
          "User-Agent": "Ozigi Content Engine Bot"
        },
      });

      if (!urlResponse.ok) {
        // If URL is blocked, check if we have manual notes to fall back on
        if (textContext && textContext.trim() !== "") {
          finalContext += `[NOTE: The provided URL was blocked by anti-bot protection, but here are the user's manual notes:]\n\n`;
        } else {
          // If we ONLY had a URL and it failed, throw the error back to the UI
          throw new Error("This website blocks AI scrapers. Please copy and paste the article text directly into the notes section!");
        }
      } else {
        // Jina returns pure Markdown! No need for crazy regex HTML replacements.
        const scrapedMarkdown = await urlResponse.text();
        finalContext += `[SOURCE ARTICLE/URL CONTENT]\n${scrapedMarkdown}\n\n`;
      }
    }

    // 2. Process Raw Notes if provided
    if (textContext && textContext.trim() !== "") {
      finalContext += `[ADDITIONAL USER NOTES/RAW TEXT]\n${textContext}\n\n`;
    }

    if (!finalContext.trim()) {
      return NextResponse.json(
        { error: "No context provided. Please enter a URL or some text notes." },
        { status: 400 }
      );
    }

    // 3. Orchestrate with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      systemInstruction:
        personaVoice || "You are a professional content architect.",
    });

    const prompt = `
      TASK: Analyze the provided context (which may include a scraped webpage, raw user notes, or both).
      Architect a 3-day social media distribution strategy based on this information. 
      CRITICAL: If the persona dictates a specific sign-off, tone, or phrase, you MUST include it in the generated text for every single post.

      SOURCE CONTEXT:
      ${finalContext}

      OUTPUT RULES:
      Return ONLY a valid JSON object. Do not include markdown formatting.
      You must include a "rule_check" field explicitly stating the exact sign-off or stylistic rule requested in the persona.
      
      Format: 
      {
        "rule_check": "I will end every post with the exact phrase: ...",
        "campaign": [
          {"day": 1, "x": "...", "linkedin": "...", "discord": "..."}
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const outputText = response.text();

    return NextResponse.json({ output: outputText });
  } catch (error: any) {
    console.error("Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}