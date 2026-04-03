import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-dodo-signature');
    const rawBody = await req.text();
    const expectedSignature = crypto
      .createHmac('sha256', process.env.DODO_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[Dodo Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log('[Dodo Webhook] Received event:', event.type, JSON.stringify(event.data?.metadata || {}));

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Map Dodo product IDs to our plan names
    const productToPlan: Record<string, string> = {
      'pdt_0Nb2mk6p1FU3JGdzuNUzt': 'team',        // team monthly
      'pdt_0Nb2varb5A2JQeOENmlfH': 'team',        // team yearly
      'pdt_0Nb2wrZKVoi4PDNwOMbbw': 'organization', // org monthly
      'pdt_0Nb2ydRec1WCRdZdQS6QW': 'organization', // org yearly
    };

    // Helper to upgrade user plan
    async function upgradePlan(userId: string, plan: string) {
      console.log('[Dodo Webhook] Upgrading user', userId, 'to plan:', plan);
      
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          plan,
          trial_ends_at: null,      // Clear trial since they're now paid
          trial_started_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('[Dodo Webhook] Update failed:', error);
        return false;
      }
      
      console.log('[Dodo Webhook] Successfully upgraded user', userId, 'to', plan);
      return true;
    }

    // Handle payment success (instant upgrade)
    if (event.type === 'payment.succeeded' || event.type === 'payment.completed') {
      const metadata = event.data?.metadata;
      const userId = metadata?.user_id;
      const planFromMetadata = metadata?.plan; // We pass this in create-checkout

      if (userId && planFromMetadata) {
        await upgradePlan(userId, planFromMetadata);
      } else {
        console.warn('[Dodo Webhook] Payment succeeded but missing user_id or plan in metadata:', metadata);
      }
    }

    // Handle subscription events
    if (event.type === 'subscription.created' || event.type === 'subscription.updated' || event.type === 'subscription.active') {
      const metadata = event.data?.metadata;
      const userId = metadata?.user_id;
      const subscriptionItems = event.data?.subscription_items || event.data?.items || [];
      const productId = subscriptionItems?.[0]?.product_id;
      
      // Prefer metadata plan, fall back to product ID lookup
      const plan = metadata?.plan || productToPlan[productId];

      if (userId && plan) {
        await upgradePlan(userId, plan);
      } else {
        console.warn('[Dodo Webhook] Subscription event but missing data:', { userId, plan, productId, metadata });
      }
    }

    // Handle subscription cancellation
    if (event.type === 'subscription.canceled' || event.type === 'subscription.cancelled') {
      const userId = event.data?.metadata?.user_id;
      if (userId) {
        console.log('[Dodo Webhook] Downgrading user', userId, 'to free (subscription canceled)');
        await supabaseAdmin
          .from('profiles')
          .update({ 
            plan: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Dodo Webhook] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
