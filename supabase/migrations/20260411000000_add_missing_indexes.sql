-- ============================================================
-- Migration: Add missing indexes on hot query columns
-- Date: 2026-04-11
-- Purpose: Cover query patterns identified by security/backend audit
-- ============================================================

-- (1) bookings.sanctuary_id
-- Used by src/hooks/useBookedDates.ts on every sanctuary calendar view:
--   .from("bookings").select("check_in, check_out")
--                    .eq("sanctuary_id", id)
--                    .in("status", ["inquiry", "confirmed"])
CREATE INDEX IF NOT EXISTS idx_bookings_sanctuary_id
    ON bookings (sanctuary_id)
    WHERE sanctuary_id IS NOT NULL;

-- (2) members.application_id
-- Used by src/components/admin/MembershipApplications.tsx when selecting
-- an application in the admin panel:
--   .from('members').select(...).eq('application_id', applicationId)
-- Also a foreign key — unindexed FKs slow down cascade checks.
CREATE INDEX IF NOT EXISTS idx_members_application_id
    ON members (application_id)
    WHERE application_id IS NOT NULL;

-- (3) approval_tokens.application_id
-- Used by the RLS policy on approval_tokens (20260206100000_security_audit_fixes.sql):
--   USING (application_id IN (SELECT id FROM membership_applications WHERE email = ...))
-- Runs on every token SELECT/UPDATE during onboarding. Also an unindexed FK.
CREATE INDEX IF NOT EXISTS idx_approval_tokens_application_id
    ON approval_tokens (application_id);
