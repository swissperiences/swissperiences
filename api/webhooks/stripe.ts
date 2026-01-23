import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

// Initialize Supabase (Admin client)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Disable body parsing for this route (handled by Vercel/Next.js config usually, 
// but for standard serverless function, we need the raw body)
export const config = {
    api: {
        bodyParser: false,
    },
};

async function buffer(readable: VercelRequest) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Webhook signature verification failed.`, error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const applicationId = session.metadata?.application_id;

        console.log(`Payment successful for application: ${applicationId}`);

        if (applicationId) {
            // Update DB
            const { error } = await supabase
                .from('waitlist')
                .update({
                    payment_status: 'paid',
                    stripe_customer_id: session.customer as string
                })
                .eq('id', applicationId);

            if (error) {
                console.error('Error updating Supabase:', error);
            }

            // Send confirmation email via Resend
            try {
                const resend = new Resend(process.env.RESEND_API_KEY!);
                // Fetch user email from session if not present in application link, 
                // but usually session.customer_details.email is reliable.
                const customerEmail = session.customer_details?.email || session.customer_email;

                if (customerEmail) {
                    await resend.emails.send({
                        from: 'hello@swissperiences.ch',
                        to: [customerEmail],
                        subject: 'Payment Confirmed: Your Swissperiences Deposit',
                        html: `
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  <style>
                                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px; color: #333; }
                                    .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #eee; }
                                    .header { text-align: center; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; color: #1A1D2E; }
                                    .content { line-height: 1.6; font-size: 16px; color: #555; }
                                    .amount { font-size: 24px; color: #1A1D2E; margin: 20px 0; font-weight: 500; }
                                    .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
                                  </style>
                                </head>
                                <body>
                                  <div class="container">
                                    <div class="header">Swissperiences</div>
                                    <div class="content">
                                      <p>Dear Traveler,</p>
                                      <p>We have received your secure deposit for the Spring 2026 Intake.</p>
                                      <div class="amount">Deposit Confirmed: CHF 500.00</div>
                                      <p>This secures your priority position. Our team will be in touch shortly with your personalized onboarding documents and next steps.</p>
                                      <p>Until then, breathe.</p>
                                    </div>
                                    <div class="footer">
                                      © 2026 Swissperiences. Geneva, Switzerland.
                                    </div>
                                  </div>
                                </body>
                              </html>
                            `
                    });
                    console.log(`[Stripe Webhook] Confirmation email sent to ${customerEmail}`);
                }
            } catch (emailError: unknown) {
                const err = emailError as Error;
                console.error('[Stripe Webhook] Failed to send email:', err);
                // Do not throw, we don't want to fail the webhook response to Stripe
            }
        }
    }

    res.status(200).json({ received: true });
}
