-- ============================================================
-- Migration: Add payment tracking columns to membership_applications
-- Date: 2026-02-10
-- Purpose: Support Stripe webhook as source of truth for payment status
-- ============================================================

ALTER TABLE membership_applications
    ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    ADD COLUMN IF NOT EXISTS paid_at timestamptz,
    ADD COLUMN IF NOT EXISTS deposit_amount numeric;

-- Index for webhook lookups by stripe_session_id
CREATE INDEX IF NOT EXISTS idx_membership_applications_stripe_session
    ON membership_applications (stripe_session_id)
    WHERE stripe_session_id IS NOT NULL;

COMMENT ON COLUMN membership_applications.payment_status IS 'Payment status set by Stripe webhook (source of truth)';
COMMENT ON COLUMN membership_applications.paid_at IS 'Timestamp when payment was confirmed by Stripe webhook';
COMMENT ON COLUMN membership_applications.deposit_amount IS 'Amount paid in the currency minor unit converted to major (e.g. 500.00 CHF)';
