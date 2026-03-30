/**
 * Newsletter signup — direct fetch, no supabase client dependency.
 *
 * The main supabase client breaks when localStorage has stale auth tokens.
 * A second supabase client with sb_publishable_* key also fails (401).
 * Direct fetch with the real JWT anon key is the only reliable approach.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Uses the standard anon key from env. After rotating the key in Supabase dashboard,
// update VITE_SUPABASE_ANON_KEY in Vercel environment variables.
const JWT_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface NewsletterResult {
    success: boolean;
    already_subscribed: boolean;
}

export async function newsletterSignup(email: string): Promise<NewsletterResult> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/newsletter-signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWT_ANON_KEY}`,
            'apikey': JWT_ANON_KEY,
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Newsletter signup failed');
    }

    return response.json();
}
