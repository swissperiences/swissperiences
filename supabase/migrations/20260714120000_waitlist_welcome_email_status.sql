-- Track welcome email delivery per waitlist signup so Resend failures
-- are visible and retryable instead of silently swallowed by the
-- newsletter-signup edge function.
alter table public.waitlist
  add column if not exists welcome_email_status text not null default 'pending'
    check (welcome_email_status in ('pending', 'sent', 'failed')),
  add column if not exists welcome_email_error text,
  add column if not exists welcome_email_attempts integer not null default 0;
