-- Migration: Fix Members RLS Policies
-- Description: Add INSERT policy and fix UPDATE policy for auto-heal flow
-- Problem: Authenticated users with approved applications cannot create/update their own member records

-- 1. Allow authenticated users to INSERT their own member record
-- This is needed for the auto-heal flow in AuthGuard when an application is approved
-- but the member record hasn't been created yet
DROP POLICY IF EXISTS "Users can insert their own member record" ON members;
CREATE POLICY "Users can insert their own member record"
    ON members
    FOR INSERT
    TO authenticated
    WITH CHECK (auth_user_id = auth.uid());

-- 2. Fix UPDATE policy to also allow updates by email match
-- This handles the case where a member record exists (created manually by admin)
-- but auth_user_id is NULL and needs to be linked to the authenticated user
DROP POLICY IF EXISTS "Members can update own profile" ON members;
CREATE POLICY "Members can update own profile"
    ON members
    FOR UPDATE
    TO authenticated
    USING (auth_user_id = auth.uid() OR (auth_user_id IS NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- 3. Expand SELECT policy to allow viewing by email match too
-- This handles the transition period where auth_user_id might not be set yet
DROP POLICY IF EXISTS "Members can view own profile" ON members;
CREATE POLICY "Members can view own profile"
    ON members
    FOR SELECT
    TO authenticated
    USING (auth_user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));
