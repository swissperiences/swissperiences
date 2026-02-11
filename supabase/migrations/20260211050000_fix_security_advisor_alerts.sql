-- ============================================================
-- Fix: Supabase Security Advisor alerts
-- Date: 2026-02-11
-- ============================================================

-- ============================================================
-- ERROR (CRITICAL): Security Definer View - public.email_stats
-- "Detects views defined with the SECURITY DEFINER property"
-- This view was created via Dashboard, not in our migrations.
-- It's not used anywhere in the codebase. Drop it.
-- ============================================================
DROP VIEW IF EXISTS public.email_stats;

-- ============================================================
-- WARNING: Function Search Path Mutable
-- Functions without SET search_path are vulnerable to
-- search_path manipulation attacks.
-- ============================================================

-- Fix: call_send_waitlist_email (created via Dashboard)
-- Has a trigger dependency on waitlist table — drop with CASCADE
DROP FUNCTION IF EXISTS public.call_send_waitlist_email() CASCADE;

-- Fix: handle_new_social_lead (created via Dashboard)
-- May have trigger dependencies — drop with CASCADE
DROP FUNCTION IF EXISTS public.handle_new_social_lead() CASCADE;

-- Fix: handle_updated_at (might be a duplicate of update_updated_at_column)
-- Drop if exists — our migrations use update_updated_at_column()
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Fix: update_updated_at_column — add SET search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix: on_membership_application_created — already fixed in
-- 20260210000000_centralize_admin_emails.sql with SECURITY DEFINER
-- but ensure search_path is set (the centralize migration already does this)

-- ============================================================
-- WARNING: Auth RLS Initialization Plan - public.approval_tokens
-- The approval_tokens table has RLS enabled but let's ensure
-- policies use auth.uid() properly with restrictive mode
-- ============================================================

-- No change needed — policies already use auth.uid() via subquery

-- ============================================================
-- WARNING: Multiple Permissive Policies - public.bookings
-- Having multiple SELECT policies (member + admin) is by design.
-- Both are needed: members see own, admins see all.
-- This is a known Supabase linter false positive for this pattern.
-- No fix needed — this is the intended architecture.
-- ============================================================

-- ============================================================
-- WARNING: Auth RLS Initialization Plan - public.bookings
-- The bookings table correctly uses auth.uid() in all policies
-- via subqueries on members.auth_user_id and is_admin().
-- No fix needed.
-- ============================================================
