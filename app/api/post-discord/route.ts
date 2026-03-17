// app/api/post-discord/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, webhookUrl } = await req.json();

    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return NextResponse.json(
        { error: "No Discord webhook configured or invalid format." },
        { status: 400 }
      );
    }

    // SSRF PROTECTION
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(webhookUrl);
    } catch (err) {
      return NextResponse.json(
        { error: "Malformed webhook URL." },
        { status: 400 }
      );
    }

    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.hostname !== "discord.com" ||
      !parsedUrl.pathname.startsWith("/api/webhooks/")
    ) {
      return NextResponse.json(
        { error: "Unauthorized webhook domain or path. Only discord.com webhooks are permitted." },
        { status: 403 }
      );
    }

    const response = await fetch(parsedUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) throw new Error("Discord rejected the payload.");

    // Increment posts_published
    await supabase.rpc("increment_posts_published", { user_id_input: user.id });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Discord Post Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}