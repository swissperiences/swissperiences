
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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


        const body = await request.json();
        const email = body.email;
        let application_id = body.application_id;

        if (!email) {
            return new Response('Email is required', { status: 400 });
        }

        // Auto-resolve application_id if not provided
        if (!application_id) {
            const { data: applicants } = await supabase
                .from('waitlist')
                .select('id')
                .eq('email', email)
                .order('created_at', { ascending: false })
                .limit(1);

            if (applicants && applicants.length > 0) {
                application_id = applicants[0].id;
            } else {
                return new Response(JSON.stringify({ error: 'No application found. Please join the waitlist first.' }), { status: 404 });
            }
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

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Stripe error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
