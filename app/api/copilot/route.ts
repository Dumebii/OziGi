import { VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";
import { getVercelOidcToken } from '@vercel/oidc';
import { ExternalAccountClient } from 'google-auth-library';
import path from "path";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'nodejs'; // Force Node.js

export async function POST(req: Request) {
  try {
    // Auth user (same as before)
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user context (optional)
    const { data: profile } = await supabase
      .from('profiles')
      .select('copilot_context')
      .eq('id', user.id)
      .single();
    const userContext = profile?.copilot_context?.trim() || "";

    // Parse messages
    const { messages } = await req.json();

    // Build contents
    const systemMessage = userContext ? { role: "user", parts: [{ text: userContext }] } : null;
    const contents = [
      ...(systemMessage ? [systemMessage] : []),
      ...messages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ];

    // ---------- AUTHENTICATION (EXACTLY LIKE GENERATE) ----------
    const projectId = process.env.GCP_PROJECT_ID || "ozigi-489021";
    let authOptions: any;

    if (process.env.VERCEL) {
      // Production on Vercel
      const projectNumber = process.env.GCP_PROJECT_NUMBER?.trim();
      const poolId = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID?.trim();
      const providerId = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID?.trim();
      const saEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL?.trim();
      const audience = `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`;
      const authClient = ExternalAccountClient.fromJSON({
        type: 'external_account',
        audience,
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        token_url: 'https://sts.googleapis.com/v1/token',
        service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${saEmail}:generateAccessToken`,
        subject_token_supplier: {
          getSubjectToken: async () => await getVercelOidcToken(),
        },
      });
      authOptions = { authClient, projectId };
    } else {
      // Development – use local file (same as generate)
      authOptions = { keyFilename: path.join(process.cwd(), "gcp-service-account.json") };
    }

    // Initialize Vertex AI
    const vertex_ai = new VertexAI({
      project: projectId,
      location: "us-central1",
      googleAuthOptions: authOptions,
    });

    const model = vertex_ai.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Stream response
    const streamingResult = await model.generateContentStream({ contents });
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamingResult.stream) {
          const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    console.error("Copilot API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}