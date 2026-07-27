/**
 * Server-side Supabase credential for the API routes.
 *
 * `SUPABASE_SECRET_KEY` holds a Supabase `sb_secret_*` API key. It replaced the
 * legacy `service_role` JWT, which was exposed and has been retired.
 *
 * This value bypasses Row Level Security. It must never be read from a
 * `VITE_*` variable or reach the browser bundle — server code only.
 */
export function getSupabaseSecretKey(): string | undefined {
    return process.env.SUPABASE_SECRET_KEY;
}
