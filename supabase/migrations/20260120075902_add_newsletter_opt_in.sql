-- Add newsletter_opt_in column to waitlist table
ALTER TABLE public.waitlist
ADD COLUMN newsletter_opt_in BOOLEAN NOT NULL DEFAULT true;

-- Add newsletter_opt_in column to corporate_inquiries table
ALTER TABLE public.corporate_inquiries
ADD COLUMN newsletter_opt_in BOOLEAN NOT NULL DEFAULT true;

-- Add index for potential newsletter filtering
CREATE INDEX idx_waitlist_newsletter_opt_in ON public.waitlist(newsletter_opt_in) WHERE newsletter_opt_in = true;
CREATE INDEX idx_corporate_inquiries_newsletter_opt_in ON public.corporate_inquiries(newsletter_opt_in) WHERE newsletter_opt_in = true;

-- Add comment explaining the column
COMMENT ON COLUMN public.waitlist.newsletter_opt_in IS 'User consent to receive newsletter and marketing communications';
COMMENT ON COLUMN public.corporate_inquiries.newsletter_opt_in IS 'User consent to receive newsletter and marketing communications';
