import { createClient } from "@/lib/supabase/server";

export type Plan = "trial" | "free" | "pro" | "power";

export interface PlanStatus {
  plan: Plan;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  canGenerate: boolean;
  generationsUsed: number;
  generationsLimit: number;
  trialEndsAt: Date | null;
}

const GENERATION_LIMITS: Record<Plan, number> = {
  trial: Infinity,
  free: 5,
  pro: 30,
  power: Infinity,
};

export async function getPlanStatus(userId: string): Promise<PlanStatus> {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("plan, trial_ends_at, generations_used_this_month, generation_reset_at")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    throw new Error("Could not fetch user profile.");
  }

  const now = new Date();
  const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const isTrialActive = profile.plan === "trial" && trialEndsAt !== null && now < trialEndsAt;
  const isTrialExpired = profile.plan === "trial" && trialEndsAt !== null && now >= trialEndsAt;

  // If trial just expired, downgrade to free automatically
  if (isTrialExpired) {
    await supabase
      .from("profiles")
      .update({ plan: "free" })
      .eq("id", userId);
  }

  const effectivePlan: Plan = isTrialExpired ? "free" : (profile.plan as Plan);
  const limit = GENERATION_LIMITS[effectivePlan];

  // Reset monthly generation count if past reset date
  const resetAt = profile.generation_reset_at ? new Date(profile.generation_reset_at) : null;
  let generationsUsed = profile.generations_used_this_month;

  if (resetAt && now >= resetAt) {
    await supabase
      .from("profiles")
      .update({
        generations_used_this_month: 0,
        generation_reset_at: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      })
      .eq("id", userId);
    generationsUsed = 0;
  }

  const canGenerate = limit === Infinity || generationsUsed < limit;

  return {
    plan: effectivePlan,
    isTrialActive,
    isTrialExpired,
    canGenerate,
    generationsUsed,
    generationsLimit: limit === Infinity ? -1 : limit,
    trialEndsAt,
  };
}

export async function incrementGenerationCount(userId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("increment_generations", { user_id_input: userId });
}