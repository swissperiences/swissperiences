-- Migration to add qualification fields to the waitlist table

ALTER TABLE "public"."waitlist" 
ADD COLUMN "company" text,
ADD COLUMN "linkedin_profile" text,
ADD COLUMN "intent" text;

-- Comment on columns for clarity
COMMENT ON COLUMN "public"."waitlist"."company" IS 'Company name or professional role of the applicant';
COMMENT ON COLUMN "public"."waitlist"."linkedin_profile" IS 'URL to professional profile or personal website';
COMMENT ON COLUMN "public"."waitlist"."intent" IS 'Primary reason for seeking membership (e.g., Rest, Adventure)';
