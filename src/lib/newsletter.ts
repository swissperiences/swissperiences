/**
 * Newsletter signup utility
 *
 * Uses a dedicated Supabase client with no auth session persistence
 * to avoid stale refresh token issues that break supabase.functions.invoke()
 * for anonymous/public-facing features.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Dedicated client for public endpoints — no session persistence
const publicClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

export interface NewsletterResult {
    success: boolean;
    already_subscribed: boolean;
}

export async function newsletterSignup(email: string): Promise<NewsletterResult> {
    const { data, error } = await publicClient.functions.invoke('newsletter-signup', {
        body: { email },
    });

    if (error) throw error;
    return data;
}
