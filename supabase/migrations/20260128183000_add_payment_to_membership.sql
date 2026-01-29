
-- Add payment and marketing fields to membership_applications
ALTER TABLE membership_applications
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN DEFAULT false;

-- Add index for payment status
CREATE INDEX IF NOT EXISTS idx_ma_payment_status ON membership_applications(payment_status);
