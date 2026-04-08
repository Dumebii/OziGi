import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { buildUpgradeWelcomeEmail } from '@/lib/email-templates';
import { SendMailClient } from 'zeptomail';
import nodemailer from 'nodemailer';

const USE_SMTP = !!process.env.SMTP_HOST;
const ZEPTOMAIL_BASE_URL = "https://api.zeptomail.com/v1.1/email";
const ZEPTOMAIL_RAW_TOKEN = process.env.ZEPTOMAIL_API_KEY!;

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

    // Helper to send upgrade welcome email
    async function sendUpgradeEmail(userId: string, plan: 'team' | 'organization' | 'enterprise') {
      try {
        // Get user profile
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('email, display_name, welcome_email_sent, welcome_email_plan')
          .eq('id', userId)
          .single();

        if (!profile?.email) {
          console.warn('[Dodo Webhook] No email found for user', userId);
          return;
        }

        // Idempotency check - don't send duplicate emails for same plan upgrade
        if (profile.welcome_email_sent && profile.welcome_email_plan === plan) {
          console.log('[Dodo Webhook] Welcome email already sent for', plan, 'to', userId);
          return;
        }

        const htmlBody = buildUpgradeWelcomeEmail({
          userName: profile.display_name || profile.email?.split('@')[0],
          plan,
        });

        const subject = plan === 'team' 
          ? "Welcome to Team - Here's what you unlocked!"
          : plan === 'organization'
          ? "Welcome to Organization - Full power unlocked!"
          : "Welcome to Enterprise - Let's build something amazing!";

        if (USE_SMTP) {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          });
          await transporter.sendMail({
            from: '"Ozigi" <hello@ozigi.app>',
            to: profile.email,
            subject,
            html: htmlBody,
          });
        } else {
          const mailClient = new SendMailClient({
            url: ZEPTOMAIL_BASE_URL,
            token: `Zoho-enczapikey ${ZEPTOMAIL_RAW_TOKEN}`,
          });
          await mailClient.sendMail({
            from: { address: 'hello@ozigi.app', name: 'Ozigi' },
            to: [{ email_address: { address: profile.email, name: profile.display_name || '' } }],
            subject,
            htmlbody: htmlBody,
          });
        }

        // Mark email as sent (idempotency)
        await supabaseAdmin
          .from('profiles')
          .update({
            welcome_email_sent: true,
            welcome_email_plan: plan,
            welcome_email_sent_at: new Date().toISOString(),
          })
          .eq('id', userId);

        console.log('[Dodo Webhook] Upgrade welcome email sent to', profile.email, 'for plan:', plan);
      } catch (emailError) {
        console.error('[Dodo Webhook] Failed to send upgrade email:', emailError);
        // Don't throw - email failure shouldn't block the upgrade
      }
    }

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
      
      // Send upgrade welcome email
      if (plan === 'team' || plan === 'organization' || plan === 'enterprise') {
        await sendUpgradeEmail(userId, plan as 'team' | 'organization' | 'enterprise');
      }
      
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
