# Stripe webhook architecture

**Status: infrastructure ready, payments not live.** Nothing in the public site
starts a real payment. This document describes the plumbing and the checklist
that must be cleared before it is switched on.

Last verified: 2026-07-28.

## Canonical implementation

`supabase/functions/stripe-webhook` is the single webhook for this project.

It was chosen over the Vercel route because the Stripe credentials already live
in Supabase Edge Function secrets, the signature verification was already
implemented there, and the function sits next to the tables it updates. Two
implementations would mean two fulfilment paths for the same event.

| | |
|---|---|
| Live endpoint | `https://rhoxismvcalqppbnndew.supabase.co/functions/v1/stripe-webhook` (`we_1SzMuf…`) |
| Test endpoint | same URL, test mode (`we_1Ty2KR…`) |
| Supported events | `checkout.session.completed`, `checkout.session.async_payment_failed` |
| Tables written | `membership_applications` (`payment_status`, `paid_at`, `deposit_amount`, `stripe_session_id`), `stripe_webhook_events` |

Any other event type is acknowledged with `2xx` and recorded as
`unhandled_event`. It never touches the database.

## Authorization

Requests are authorized by the `Stripe-Signature` header, verified with
`constructEventAsync` over the **raw** request body. Parsing and re-serialising
the body would change the bytes and every signature would fail.

Nothing runs before that check: no database client is created, no email is sent,
no row is read. A request with no signature, a bad signature, or a tampered body
is rejected with `400`.

### Why `verify_jwt = false`

Declared in `supabase/config.toml` for this function **only**:

```toml
[functions.stripe-webhook]
enabled = true
verify_jwt = false
```

Stripe signs with its own scheme and never sends a Supabase JWT, so the gateway
rejected every delivery before the function could run. This is not a weakening
of authorization — it replaces a check Stripe cannot satisfy with the one it
actually provides. Every other Edge Function keeps `verify_jwt = true`.

### Signing secrets

Both `STRIPE_WEBHOOK_SECRET` (live) and `STRIPE_WEBHOOK_SECRET_TEST` are
accepted, so the two endpoints coexist. Each secret only validates events from
its own mode, so nothing is mixed: an event is trusted because its own
endpoint's secret signed it. Swapping a single value in and out to run tests
would have left live traffic unverifiable in the meantime.

## Idempotency

Stripe guarantees **at-least-once** delivery and retries on any non-`2xx`. The
same event id will arrive more than once.

`stripe_webhook_events` keys on Stripe's own `event_id` as primary key:

1. The event id is inserted before any processing.
2. A unique violation means it was already handled — respond `2xx` and do
   nothing else.
3. On success the row records `processed_at`, `outcome` and `application_id`.
4. **On failure the row is deleted**, so Stripe's retry is not mistaken for a
   duplicate. Without this, one crash would suppress the payment forever.

`outcome` is one of `processed`, `skipped_unpaid`, `application_not_found`,
`payment_failed`, `unhandled_event`. RLS is enabled with no policies: only the
server-side key reads it.

## Deprecated: the Vercel route

`api/webhooks/stripe.ts` is **deprecated and must not be extended**. It has
never processed an event — no `STRIPE_*` variable exists in any Vercel
environment, so its Stripe client cannot even be constructed.

Its Stripe endpoint (`https://www.swissperiences.ch/api/webhooks/stripe`,
`we_1SsvZI…`) is to be **disabled, not deleted**, and kept that way through an
observation window. The file stays in the repository until the Supabase
architecture has been validated end to end.

**Do not add `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` to Vercel.** Two
live endpoints subscribed to `checkout.session.completed` means duplicated
fulfilment.

## Verified behaviour

Tested in test mode against the dedicated endpoint, with QA records that were
removed afterwards:

| Scenario | Expected | Result |
|---|---|---|
| Missing `Stripe-Signature` | reject | `400` |
| Invalid signature | reject | `400` |
| Tampered body | reject | `400` |
| `GET` | reject | `405` |
| Valid `checkout.session.completed` | `2xx`, row updated | `paid`, `paid_at`, `deposit_amount`, `stripe_session_id` written |
| Same event redelivered | `2xx`, no second change | one ledger row, `paid_at` unchanged |
| Session not paid | skip | `skipped_unpaid` |
| No `client_reference_id` | controlled error | `application_not_found`, no row touched |
| `checkout.session.async_payment_failed` | mark failed | `payment_failed`, `paid_at` null |
| Unsupported event type | safe acknowledge | `unhandled_event` |

## Before enabling real payments

Payments are deliberately absent from the public experience: no checkout on the
homepage, no payment buttons, no prices wired, no real applicant marked paid, no
live card ever charged.

Clear all of this first:

- [ ] **Confirm the live signing secret matches the live endpoint.** Never
      verified. Stripe only reveals a signing secret at creation and the stored
      value cannot be read back. The dates line up — both the secret and the
      live endpoint are from 2026-02-10 — but that is circumstantial. If live
      deliveries fail with a signature error, this is the first suspect.
      Re-roll the endpoint secret and set it in one operation to remove the
      doubt.
- [ ] **Reconcile the API version.** The function pinned `2023-10-16` while both
      endpoints are on `2025-12-15.clover`; it now pins `2025-12-15.clover`.
      Confirm the shape of `checkout.session.completed` under that version still
      matches what the handler reads, and re-check whenever the endpoint version
      changes.
- [ ] **Alert on `application_not_found`.** A genuinely paid session whose
      application cannot be resolved is money taken with nothing fulfilled.
      Today it is only a ledger row and a log line — it needs an alert and a
      manual review path.
- [ ] Disable the duplicate Vercel endpoint and let the observation window pass.
- [ ] Exercise one real live payment end to end before opening it to guests.
