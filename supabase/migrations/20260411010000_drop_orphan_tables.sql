-- ============================================================
-- Migration: Drop orphan tables created via Supabase Dashboard
-- Date: 2026-04-11
-- Purpose: Codify source-of-truth in Git. All 5 tables verified on 2026-04-11:
--   - empty (0 rows)
--   - not referenced in src/, api/, supabase/functions/, scripts/
--   - duplicate functionality of existing tables, or abandoned experiments
--
-- Verification queries run before drop:
--   SELECT relname, n_live_tup FROM pg_stat_user_tables
--   WHERE schemaname = 'public'
--     AND relname IN ('profiles','retreats','leads','email_logs','newsletter_subscribers');
--   -- all returned n_live_tup = 0
--
-- Existing defensive migration 20260211060000_fix_remaining_security_warnings.sql
-- references `leads` and `newsletter_subscribers` via IF EXISTS guards — those
-- branches become no-ops after this migration, with no breakage.
-- ============================================================

-- profiles: Supabase Auth starter leftover. Our member profile lives
-- in the `members` table (see 20260128000000_membership_system.sql).
DROP TABLE IF EXISTS public.profiles CASCADE;

-- retreats: abandoned DB-backed experiment. Retreats content is static
-- in src/data/retreats.ts and consumed via @/data/retreats imports.
DROP TABLE IF EXISTS public.retreats CASCADE;

-- leads: duplicate of corporate_inquiries. The `leads` state variable
-- in src/pages/AdminGallery.tsx actually reads from corporate_inquiries
-- (lines 170, 806) — the name is only a business-domain label.
DROP TABLE IF EXISTS public.leads CASCADE;

-- email_logs: abandoned experiment, never referenced in the codebase.
DROP TABLE IF EXISTS public.email_logs CASCADE;

-- newsletter_subscribers: duplicate of waitlist. The newsletter-signup
-- edge function upserts into `waitlist` (supabase/functions/newsletter-signup/index.ts:33),
-- not this table.
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
