/**
 * Newsletter signup utility
 *
 * Uses direct fetch with the anon key instead of supabase.functions.invoke()
 * to avoid auth session issues — stale/invalid refresh tokens in localStorage
 * cause supabase.functions.invoke() to throw FunctionsHttpError even for
 * public endpoints that don't require authentication.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface NewsletterResult {
    success: boolean;
    already_subscribed: boolean;
}

export async function newsletterSignup(email: string): Promise<NewsletterResult> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/newsletter-signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Newsletter signup failed');
    }

    return response.json();
}
