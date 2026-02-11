-- ============================================================
-- Fix: Bookings INSERT policy was manually overwritten with wrong column name
-- The members table uses "membership_status" (not "status")
-- and value "active" (not "approved")
-- ============================================================

-- Drop ALL existing booking policies and recreate them correctly
DROP POLICY IF EXISTS "Members can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Members can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Members can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON bookings;

-- Members can INSERT their own bookings (must be active member)
CREATE POLICY "Members can create own bookings"
    ON bookings FOR INSERT
    TO authenticated
    WITH CHECK (
        member_id IN (
            SELECT id FROM members
            WHERE auth_user_id = auth.uid()
            AND membership_status = 'active'
        )
    );

-- Members can view their own bookings
CREATE POLICY "Members can view own bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (
        member_id IN (
            SELECT id FROM members
            WHERE auth_user_id = auth.uid()
        )
    );

-- Members can update their own bookings (cancel, etc.)
CREATE POLICY "Members can update own bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (
        member_id IN (
            SELECT id FROM members
            WHERE auth_user_id = auth.uid()
        )
    );

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Admins can update all bookings (confirm, cancel, etc.)
CREATE POLICY "Admins can update all bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
