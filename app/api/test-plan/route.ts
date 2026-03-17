// app/api/test-plan/route.ts
import { NextResponse } from "next/server";
import { getPlanStatus } from "@/lib/plan";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No user" }, { status: 401 });

  try {
    const status = await getPlanStatus(user.id);
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}