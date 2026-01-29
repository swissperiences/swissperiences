-- Create waitlist table for email signups
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (public signup)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'waitlist' 
        AND policyname = 'Anyone can join waitlist'
    ) THEN
        CREATE POLICY "Anyone can join waitlist" 
        ON public.waitlist 
        FOR INSERT 
        WITH CHECK (true);
    END IF;
END
$$;

-- Only allow reading own entry (by email match - though typically admin would read)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'waitlist' 
        AND policyname = 'Users cannot read waitlist'
    ) THEN
        CREATE POLICY "Users cannot read waitlist" 
        ON public.waitlist 
        FOR SELECT 
        USING (false);
    END IF;
END
$$;