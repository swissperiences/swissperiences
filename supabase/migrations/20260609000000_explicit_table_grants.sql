-- Explicit table GRANTs required after Supabase Data API default change (Oct 30, 2026).
-- Without these, new tables won't be accessible via PostgREST/supabase-js after that date.
-- Grants mirror the existing RLS policies — RLS still enforces row-level access.

-- waitlist: anon inserts, admins read
GRANT INSERT ON public.waitlist TO anon;
GRANT SELECT, INSERT ON public.waitlist TO authenticated;

-- corporate_inquiries: anon inserts, admins read
GRANT INSERT ON public.corporate_inquiries TO anon;
GRANT SELECT, INSERT ON public.corporate_inquiries TO authenticated;

-- membership_applications: anon/authenticated insert, authenticated read/update
GRANT INSERT ON public.membership_applications TO anon;
GRANT SELECT, INSERT, UPDATE ON public.membership_applications TO authenticated;

-- members: authenticated read/update (own row via RLS)
GRANT SELECT, INSERT, UPDATE ON public.members TO authenticated;

-- approval_tokens: only accessed via service_role RPCs, no direct client access needed
GRANT SELECT ON public.approval_tokens TO service_role;

-- admin_emails: authenticated read (admin check)
GRANT SELECT ON public.admin_emails TO authenticated;

-- admin_inventory, admin_partners: admin-only
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_inventory TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_partners TO authenticated;

-- admin_tasks, admin_concepts: admin-only
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_concepts TO authenticated;

-- bookings: authenticated insert/read/update (own rows via RLS)
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;

-- blocked_dates: admin write via RLS, read via RPC (authenticated)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_dates TO authenticated;

-- discovery_packs + includes: public read, admin write
GRANT SELECT ON public.discovery_packs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discovery_packs TO authenticated;

GRANT SELECT ON public.discovery_pack_includes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discovery_pack_includes TO authenticated;
