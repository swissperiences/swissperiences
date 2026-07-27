/**
 * Server-side Supabase credential for the API routes.
 *
 * Prefers the new `sb_secret_*` API key and falls back to the legacy
 * `service_role` JWT while the rotation is in flight. Once every deployment
 * reads the new key, drop `SUPABASE_SERVICE_ROLE_KEY` here and in Vercel.
 *
 * This value bypasses Row Level Security. It must never be read from a
 * `VITE_*` variable or reach the browser bundle — server code only.
 */
export function getSupabaseSecretKey(): string | undefined {
    return process.env.SUPABASE_SECRET_KEY_NEXT || process.env.SUPABASE_SERVICE_ROLE_KEY;
}
