import { supabase } from "@/lib/supabase/client";

export interface MarketplacePersona {
  id: string;
  name: string;
  prompt: string;
  description: string;
  is_featured: boolean;
  order_index: number;
}

/**
 * Fetch all marketplace personas (the 8 pre-built ones)
 */
export async function getMarketplacePersonas(): Promise<MarketplacePersona[]> {
  const { data, error } = await supabase
    .from("marketplace_personas")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[Personas] Error fetching marketplace personas:", error);
    return [];
  }

  return data || [];
}

/**
 * Save a marketplace persona to user's personal personas and redirect to dashboard
 * This copies the marketplace persona to user_personas table
 */
export async function savePersonaAndRedirect(
  userId: string,
  personaName: string,
  personaPrompt: string
): Promise<{ success: boolean; personaId?: string; error?: string }> {
  try {
    // Check if user already has this persona saved
    const { data: existing } = await supabase
      .from("user_personas")
      .select("uuid")
      .eq("user_id", userId)
      .eq("name", personaName)
      .maybeSingle();

    if (existing) {
      // Already saved, just return the ID
      return { success: true, personaId: existing.uuid };
    }

    // Insert new persona
    const { data: inserted, error: insertError } = await supabase
      .from("user_personas")
      .insert({
        user_id: userId,
        name: personaName,
        prompt: personaPrompt,
      })
      .select("uuid")
      .single();

    if (insertError) {
      console.error("[Personas] Error saving persona:", insertError);
      return { success: false, error: insertError.message };
    }

    // Trigger refresh event for other components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("refreshPersonas"));
    }

    return { success: true, personaId: inserted.uuid };
  } catch (error: any) {
    console.error("[Personas] Unexpected error:", error);
    return { success: false, error: error.message };
  }
}
