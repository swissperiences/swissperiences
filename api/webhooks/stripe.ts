
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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

async function buffer(readable: any) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
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

            // TODO: Send confirmation email via Resend
        }
    }

    res.status(200).json({ received: true });
}
