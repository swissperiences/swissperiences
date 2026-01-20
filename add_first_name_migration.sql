-- Add first_name column to waitlist table
ALTER TABLE public.waitlist
ADD COLUMN IF NOT EXISTS first_name TEXT;

-- Add comment
COMMENT ON COLUMN public.waitlist.first_name IS 'Optional first name for personalization';
