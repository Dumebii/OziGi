import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, interval = 'monthly', successUrl, cancelUrl } = await req.json();

    // Map plan name + interval to Dodo product IDs
    const productIds = {
      team: {
        monthly: 'pdt_0Nb2mk6p1FU3JGdzuNUzt',      // replace with actual Dodo product ID
        yearly: 'pdt_0Nb2varb5A2JQeOENmlfH',
      },
      organization: {
        monthly: 'pdt_0Nb2wrZKVoi4PDNwOMbbw',
        yearly: 'pdt_0Nb2ydRec1WCRdZdQS6QW',
      },
    };
    const productId = productIds[plan as keyof typeof productIds]?.[interval as 'monthly' | 'yearly'];
    if (!productId) {
      return NextResponse.json({ error: 'Invalid plan or interval' }, { status: 400 });
    }

    // Dodo API expects `mode` to be 'subscription' for recurring plans
    const response = await fetch('https://api.dodopayments.com/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DODO_API_KEY}`,
      },
      body: JSON.stringify({
        product_id: productId,
        mode: 'subscription',
        success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
        cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancel`,
        customer_email: user.email,
        metadata: {
          user_id: user.id,
          plan,
          interval,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create checkout');

    return NextResponse.json({ checkoutUrl: data.checkout_url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}