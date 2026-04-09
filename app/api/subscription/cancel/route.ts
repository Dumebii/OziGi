import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Cancellation reasons for analytics
const VALID_REASONS = [
  'too_expensive',
  'not_using',
  'found_alternative',
  'missing_features',
  'technical_issues',
  'other',
] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reason, feedback } = body;

    // Validate reason
    if (!reason || !VALID_REASONS.includes(reason)) {
      return NextResponse.json(
        { error: 'Invalid cancellation reason' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              console.error('Failed to set cookies', error);
            }
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's current plan from profiles
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('plan, email, display_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Can't cancel if already on free plan
    if (profile.plan === 'free') {
      return NextResponse.json(
        { error: 'You are already on the free plan' },
        { status: 400 }
      );
    }

    const previousPlan = profile.plan;

    // Update profile to free plan and record cancellation
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: 'free',
        cancellation_requested_at: new Date().toISOString(),
        cancellation_reason: reason,
        cancellation_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[Cancel Subscription] Update failed:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      );
    }

    // Log the cancellation for analytics (optional: could be separate table)
    console.log('[Cancel Subscription] User cancelled:', {
      userId: user.id,
      previousPlan,
      reason,
      feedback: feedback || null,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      previousPlan,
    });

  } catch (error: any) {
    console.error('[Cancel Subscription] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
