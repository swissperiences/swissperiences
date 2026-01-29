-- Create a table for corporate retreat inquiries
CREATE TABLE IF NOT EXISTS public.corporate_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  team_size TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.corporate_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit an inquiry (public form)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'corporate_inquiries' 
        AND policyname = 'Anyone can submit corporate inquiry'
    ) THEN
        CREATE POLICY "Anyone can submit corporate inquiry" 
        ON public.corporate_inquiries 
        FOR INSERT 
        WITH CHECK (true);
    END IF;
END
$$;

-- Users cannot read inquiries (admin only via dashboard)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'corporate_inquiries' 
        AND policyname = 'Users cannot read inquiries'
    ) THEN
        CREATE POLICY "Users cannot read inquiries" 
        ON public.corporate_inquiries 
        FOR SELECT 
        USING (false);
    END IF;
END
$$;

-- Add index on email for potential lookups
CREATE INDEX IF NOT EXISTS idx_corporate_inquiries_email ON public.corporate_inquiries(email);

-- Add index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_corporate_inquiries_created_at ON public.corporate_inquiries(created_at DESC);