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
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Map product IDs to our plan names
    const productToPlan: Record<string, string> = {
      prod_team_monthly: 'pdt_0Nb2mk6p1FU3JGdzuNUzt',
      prod_team_yearly: 'pdt_0Nb2varb5A2JQeOENmlfH',
      prod_org_monthly: 'pdt_0Nb2wrZKVoi4PDNwOMbbw',
      prod_org_yearly: 'pdt_0Nb2ydRec1WCRdZdQS6QW',
      // Add your actual product IDs here
    };

    if (event.type === 'subscription.created' || event.type === 'subscription.updated') {
      const { customer_email, metadata, subscription_items } = event.data;
      const productId = subscription_items?.[0]?.product_id;
      const plan = productToPlan[productId] || 'free';

      // Update user profile
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          plan,
          updated_at: new Date().toISOString(),
        })
        .eq('id', metadata?.user_id);

      if (error) console.error('Update failed:', error);
    }

    if (event.type === 'subscription.canceled') {
      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free' })
        .eq('id', event.data.metadata?.user_id);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}