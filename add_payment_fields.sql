-- Add payment tracking fields to the waitlist table

ALTER TABLE "public"."waitlist" 
ADD COLUMN "payment_status" text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
ADD COLUMN "stripe_customer_id" text,
ADD COLUMN "stripe_session_id" text;

-- Add index for faster lookups by payment status
CREATE INDEX idx_waitlist_payment_status ON "public"."waitlist" ("payment_status");
