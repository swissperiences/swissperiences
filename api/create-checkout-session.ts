
import Stripe from 'stripe';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from './lib/rate-limit.js';

export const config = {
    runtime: 'edge', // Using Edge Runtime for better performance/standard API compatibility
};

const ALLOWED_ORIGINS = ['https://swissperiences.ch', 'https://www.swissperiences.ch'];

function getCorsHeaders(request: Request) {
    const origin = request.headers.get('origin') || '';
    return {
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
}

export default async function handler(request: Request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response('ok', { headers: getCorsHeaders(request) });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) }
        });
    }

    // Rate limit check
    const clientIp = (request.headers.get('x-real-ip'))
        || (request.headers.get('x-forwarded-for'))?.split(',')[0]?.trim()
        || 'anonymous';
    // Reuse 'corporate' bucket (3/10min) — checkout doesn't need its own limit type
    const { success: rateLimitOk } = await checkRateLimit(clientIp, 'corporate');
    if (!rateLimitOk) {
        return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) }
        });
    }

    try {
        // Validation: Environment Variables
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('CRITICAL: STRIPE_SECRET_KEY is missing from environment variables.');
            return new Response(JSON.stringify({ error: 'Server configuration error: Stripe key missing' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) }
            });
        }

        if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('CRITICAL: Supabase credentials missing from environment variables.');
            return new Response(JSON.stringify({ error: 'Server configuration error: Supabase credentials missing' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) }
            });
        }

        // Initialize Clients (Lazy init inside handler to catch errors)
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-12-15.clover', // Matched to installed types
        });

        const supabase = createClient(
            process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const body = await request.json();
        const { email, intent, tier, application_id: providedAppId } = body;
        let application_id = providedAppId;

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) }
            });
        }

        const rawOrigin = request.headers.get('origin') || '';
        const origin = ALLOWED_ORIGINS.includes(rawOrigin) ? rawOrigin : 'https://swissperiences.ch';

        // Auto-resolve application_id if not provided
        if (!application_id) {
            const { data: applicants, error: fetchError } = await supabase
                .from('waitlist')
                .select('id')
                .eq('email', email)
                .order('created_at', { ascending: false })
                .limit(1);

            if (fetchError) {
                console.error('Supabase lookup error:', fetchError);
                // Don't block payment if DB fails, but log it.
            }

            if (applicants && applicants.length > 0) {
                application_id = applicants[0].id;
            } else {
                // Generic error to prevent email enumeration
                return new Response(JSON.stringify({ error: 'Unable to process request. Please ensure you have submitted an application.' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) }
                });
            }
        }

        // 1. Create Stripe Checkout Session
        const isGBP = tier?.includes('£') || tier?.toLowerCase().includes('gbp');
        const currency = isGBP ? 'gbp' : 'chf';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: tier ? `Deposit: ${tier}` : 'Retreat Deposit - Spring 2026',
                            description: 'Refundable deposit to secure your priority spot.',
                            // images: ['https://swissperiences.ch/images/retreat-deposit.jpg'], // Ensure this image exists or remove
                        },
                        unit_amount: 50000, // 500.00 in selected currency
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            allow_promotion_codes: true,
            success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}`,
            cancel_url: `${origin}/?payment=cancelled`,
            customer_email: email,
            metadata: {
                application_id: application_id,
                intent: intent || 'general',
                product_name: tier || 'General Deposit',
                environment: process.env.NODE_ENV || 'production'
            },
        });

        // 2. Update Waitlist Record with Stripe Session ID
        // Note: This is best effort. Webhook is the source of truth for 'paid'.
        if (application_id) {
            // Update Stripe Session ID and Marketing Preference
            await supabase
                .from('waitlist')
                .update({
                    stripe_session_id: session.id,
                    newsletter_opt_in: !!body.marketing_opt_in
                })
                .eq('id', application_id);

            // 3. Sync to Resend Audience (if opted-in)
            if (body.marketing_opt_in && process.env.RESEND_AUDIENCE_ID && process.env.RESEND_API_KEY) {
                const resend = new Resend(process.env.RESEND_API_KEY);

                // Fire and forget - don't block checkout redirect
                (async () => {
                    try {
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit safety
                        await resend.contacts.create({
                            email: email,
                            audienceId: process.env.RESEND_AUDIENCE_ID!,
                            unsubscribed: false,
                        });
                        console.log(`[Checkout] Synced ${email} to Resend Audience`);
                    } catch (err) {
                        console.error('[Checkout] Failed to sync Resend contact:', err);
                    }
                })();
            }
        }

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) },
        });

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Stripe Checkout Error:', err);
        return new Response(JSON.stringify({
            error: 'Internal server error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...getCorsHeaders(request) }
        });
    }
}
