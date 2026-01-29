-- Migration: Membership Application System
-- Description: Creates tables for exclusive membership flow (apply → approve → access)

-- 1. Applications (people requesting access)
CREATE TABLE IF NOT EXISTS membership_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic info
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    city TEXT,
    country TEXT,

    -- Application details
    reason TEXT, -- "What brought you here?"
    referral_source TEXT, -- linkedin, friend, google, other
    referral_detail TEXT, -- if "friend", who?

    -- Status tracking
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, waitlist
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Members (approved applications who created accounts)
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Link to auth
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES membership_applications(id),

    -- Profile
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    city TEXT,
    country TEXT,

    -- Membership details
    membership_tier TEXT DEFAULT 'founding', -- founding, standard, vip
    membership_status TEXT DEFAULT 'active', -- active, paused, cancelled
    joined_at TIMESTAMPTZ DEFAULT NOW(),

    -- Engagement tracking
    last_login_at TIMESTAMPTZ,
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Approval tokens (for secure onboarding links)
CREATE TABLE IF NOT EXISTS approval_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES membership_applications(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Applications: allow anyone to insert, only admins can read/update
DROP POLICY IF EXISTS "Anyone can submit application" ON membership_applications;
CREATE POLICY "Anyone can submit application"
    ON membership_applications 
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow service role to read all (for admin panel)
DROP POLICY IF EXISTS "Service role can read all applications" ON membership_applications;
CREATE POLICY "Service role can read all applications"
    ON membership_applications
    FOR SELECT
    TO service_role
    USING (true);

-- Allow authenticated users to read all (for admin)
DROP POLICY IF EXISTS "Authenticated can read applications" ON membership_applications;
CREATE POLICY "Authenticated can read applications"
    ON membership_applications
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated to update (for admin approval)
DROP POLICY IF EXISTS "Authenticated can update applications" ON membership_applications;
CREATE POLICY "Authenticated can update applications"
    ON membership_applications
    FOR UPDATE
    TO authenticated
    USING (true);

-- Members: users can only see their own profile
DROP POLICY IF EXISTS "Members can view own profile" ON members;
CREATE POLICY "Members can view own profile"
    ON members FOR SELECT
    USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Members can update own profile" ON members;
CREATE POLICY "Members can update own profile"
    ON members FOR UPDATE
    USING (auth_user_id = auth.uid());

-- Tokens: only accessible via direct query (service role)
DROP POLICY IF EXISTS "Tokens are private" ON approval_tokens;
CREATE POLICY "Tokens are private"
    ON approval_tokens FOR SELECT
    USING (false);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_email ON membership_applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON membership_applications(status);
CREATE INDEX IF NOT EXISTS idx_members_auth_user ON members(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_tokens_token ON approval_tokens(token);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_applications_updated_at ON membership_applications;
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON membership_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for Membership Application Notifications
-- This calls the 'notify-application' Edge Function whenever a new application is inserted
CREATE OR REPLACE FUNCTION public.on_membership_application_created()
RETURNS TRIGGER AS $$
DECLARE
  headers_json jsonb;
  api_key text;
BEGIN
  -- Safely get request headers from PostgREST context
  BEGIN
    headers_json := current_setting('request.headers', true)::jsonb;
  EXCEPTION WHEN OTHERS THEN
    headers_json := '{}'::jsonb;
  END;
  
  -- Extract the apikey for the Edge Function call
  api_key := COALESCE(headers_json->>'apikey', '');

  PERFORM
    net.http_post(
      url := 'https://rhoxismvcalqppbnndew.supabase.co/functions/v1/notify-application',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || api_key
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Prevent the insertion from failing if the webhook fails
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_membership_application_created_trigger ON membership_applications;
CREATE TRIGGER on_membership_application_created_trigger
  AFTER INSERT ON membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.on_membership_application_created();
