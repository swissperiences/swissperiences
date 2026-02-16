/**
 * Newsletter signup — direct fetch, no supabase client dependency.
 *
 * The main supabase client breaks when localStorage has stale auth tokens.
 * A second supabase client with sb_publishable_* key also fails (401).
 * Direct fetch with the real JWT anon key is the only reliable approach.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// The JWT anon key (public, safe to embed — it's in every browser request anyway)
const JWT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJob3hpc212Y2FscXBwYm5uZGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMzY0NDMsImV4cCI6MjA4MTkxMjQ0M30.deevTxvGsEgx9eihvuj3KaRre9Goa2bOunmOZU2L7v0';

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
