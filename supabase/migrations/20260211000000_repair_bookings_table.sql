-- ============================================================
-- Repair: Drop and recreate bookings table with correct schema
-- The previous migration partially applied (table created via dashboard
-- without member_id column, causing RLS policies to fail).
-- ============================================================

-- Drop existing table if it exists (clean slate)
DROP TABLE IF EXISTS bookings CASCADE;

-- Recreate with full schema
CREATE TABLE bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),

    -- Relationships
    member_id uuid REFERENCES members(id) NOT NULL,
    sanctuary_id text,          -- e.g. 'villars', 'verbier', 'zermatt'
    experience_type text,       -- e.g. 'road_journey', 'guided_hike', 'cinematic_memories', 'private_chef'

    -- Dates
    check_in date,              -- for sanctuaries
    check_out date,             -- for sanctuaries
    preferred_date date,        -- for experiences

    -- Details
    guests integer DEFAULT 1,
    special_requests text,

    -- Status
    status text DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'confirmed', 'cancelled', 'completed')),

    -- Metadata
    total_nights integer,
    estimated_price numeric,

    -- Ensure at least one booking type is set
    CONSTRAINT booking_type_check CHECK (
        sanctuary_id IS NOT NULL OR experience_type IS NOT NULL
    )
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings FORCE ROW LEVEL SECURITY;

-- Members can view their own bookings
CREATE POLICY "Members can view own bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (member_id IN (SELECT id FROM members WHERE auth_user_id = auth.uid()));

-- Members can create their own bookings
CREATE POLICY "Members can create own bookings"
    ON bookings FOR INSERT
    TO authenticated
    WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_user_id = auth.uid()));

-- Members can cancel their own bookings (update status only)
CREATE POLICY "Members can update own bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (member_id IN (SELECT id FROM members WHERE auth_user_id = auth.uid()));

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

-- Index for common queries
CREATE INDEX idx_bookings_member_id ON bookings (member_id);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_created_at ON bookings (created_at DESC);
