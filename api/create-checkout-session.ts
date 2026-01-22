
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover', // Matched to installed types
});

// Initialize Supabase (Admin client for secure updates)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { email, application_id } = await request.json();

        if (!email || !application_id) {
            return new Response('Missing required fields', { status: 400 });
        }

        // 1. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'chf',
                        product_data: {
                            name: 'Retreat Deposit - Spring 2026',
                            description: 'Refundable deposit to secure your spot for the Spring 2026 intake.',
                            images: ['https://swissperiences.com/images/retreat-deposit.jpg'], // Placeholder image
                        },
                        unit_amount: 50000, // CHF 500.00 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/?payment=cancelled`,
            customer_email: email,
            metadata: {
                application_id: application_id, // Link to Supabase record
            },
        });

        // 2. Update Waitlist Record with Stripe Session ID
        const { error } = await supabase
            .from('waitlist')
            .update({ stripe_session_id: session.id })
            .eq('id', application_id);

        if (error) {
            console.error('Supabase update error:', error);
            // Continue anyway, as we can reconcile via webhook
        }

        return new Response(JSON.stringify({ url: session.url }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Stripe error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
