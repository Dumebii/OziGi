import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getPlanStatus } from "@/lib/plan";

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [planStatus, statsResult, personaResult] = await Promise.all([
    getPlanStatus(user.id),
    supabase
      .from("user_stats")
      .select("campaigns_generated, posts_published")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("personas")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return NextResponse.json({
    plan: planStatus.plan,
    isTrialActive: planStatus.isTrialActive,
    isTrialExpired: planStatus.isTrialExpired,
    canGenerate: planStatus.canGenerate,
    generationsUsed: planStatus.generationsUsed,
    generationsLimit: planStatus.generationsLimit,
    trialEndsAt: planStatus.trialEndsAt,
    stats: {
      campaignsGenerated: statsResult.data?.campaigns_generated ?? 0,
      postsPublished: statsResult.data?.posts_published ?? 0,
      personasSaved: personaResult.count ?? 0,
    },
  });
}