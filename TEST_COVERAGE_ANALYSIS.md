# Test Coverage Analysis

**Date:** 2026-04-13
**Current coverage:** 0% — no test framework configured, no test files exist.

---

## Executive Summary

The Swissperiences codebase has **zero automated tests**. There is no test framework installed, no test scripts in `package.json`, and no test files anywhere in the repository. Given that this is a production application handling **payments (Stripe), authentication (Supabase), transactional emails (Resend), and rate limiting (Upstash)**, this is a significant risk area.

Below is a prioritized breakdown of what to test, ordered by **business impact and risk**.

---

## Priority 1: Critical Business Logic (Unit Tests)

These are pure or near-pure functions with no UI dependencies. They are the easiest to test and protect the most important logic.

### 1.1 Revenue Engine — `src/lib/revenue-engine.ts`

**Risk:** Financial miscalculations directly affect pricing shown to guests.

| Function | What to test |
|---|---|
| `calculateGuestPrice(baseCost, marginRate)` | Standard margin (20%), edge case `marginRate >= 1` guard, zero base cost, large numbers, floating-point precision |
| `calculateCommission(guestPrice, feeRate)` | Standard fee (30%), zero fee, rounding behavior (`Math.floor`) |
| `formatCurrency(amount, currency)` | CHF formatting, GBP formatting, zero, large numbers, locale-specific separators |
| `getRevenueBreakdown(baseCost, marginRate)` | End-to-end breakdown correctness, `commissionAmount === guestPrice - baseCost` invariant |

**Effort:** Low. Pure functions, no mocking needed.

### 1.2 Server-Side Price Catalog — `api/send-guest-inquiry.ts`

**Risk:** The `PRICE_CATALOG` object is the server-side source of truth for guest upsell pricing. If catalog items are removed or renamed, the validation loop silently rejects requests.

| What to test |
|---|
| Selection validation: known IDs resolve, unknown IDs return 400 |
| Server-side total recalculation matches expected sum |
| Category filtering (`experience` vs `extra`) works correctly |
| Edge case: empty selections array, duplicate selections, max selections |

**Effort:** Low-medium. Requires extracting validation logic into a testable function.

### 1.3 Date Expansion Logic — `src/hooks/useBookedDates.ts`

**Risk:** Incorrect date expansion means double-bookings or falsely blocked dates.

| Function | What to test |
|---|---|
| `getBookedDatesForSanctuary()` (date expansion) | Single-day booking, multi-day range, overlapping ranges produce unique dates, malformed date strings are skipped |

**Effort:** Low-medium. The `eachDayOfInterval` / `parseISO` / `format` pipeline is testable once Supabase is mocked.

### 1.4 Blocked Dates Response Parsing — `src/hooks/useBlockedDates.ts`

**Risk:** The RPC returns `jsonb` which could be an array or a stringified array. Incorrect parsing silently returns `[]`.

| What to test |
|---|
| Array input returns as-is |
| JSON string input gets parsed correctly |
| Non-array/non-string input returns `[]` |
| Parse failure returns `[]` |

**Effort:** Low. Pure parsing logic.

---

## Priority 2: API Route Handlers (Integration Tests)

These are Vercel serverless functions that handle HTTP requests, validate input, call external services, and return responses. They are the most critical integration points.

### 2.1 Stripe Checkout — `api/create-checkout-session.ts`

| What to test |
|---|
| CORS: allowed origins get headers, disallowed origins get empty `Access-Control-Allow-Origin` |
| Method enforcement: OPTIONS returns 200, non-POST returns 405 |
| Rate limiting: 6th request within 10 min window returns 429 |
| Input validation: missing email returns 400 |
| Application lookup: email with no waitlist entry returns 400 (prevents email enumeration) |
| Currency detection: tier containing `£` or `gbp` uses GBP, otherwise CHF |
| Happy path: returns `{ url: "..." }` with status 200 |

**Effort:** Medium. Requires mocking Stripe, Supabase, Resend, and Upstash Redis.

### 2.2 Waitlist Email — `api/send-waitlist-email.ts`

| What to test |
|---|
| Email validation regex rejects malformed emails |
| Duplicate email (Postgres 23505) returns 200 with "already registered" |
| Language detection: `pt` prefix selects Portuguese translations |
| DB insert happens before email send (ordering) |
| Test mode: `EMAIL_TEST_MODE=true` skips actual email send |
| Rate limiting integration |

**Effort:** Medium.

### 2.3 Corporate Inquiry — `api/send-inquiry-email.ts`

| What to test |
|---|
| Required fields: missing `companyName` or `contactName` returns 400 |
| HTML escaping (`esc()` function) prevents XSS in emails |
| DB failure is non-blocking (emails still sent) |
| Resend rate limit delay (1100ms between emails) |

**Effort:** Medium.

### 2.4 Guest Inquiry — `api/send-guest-inquiry.ts`

| What to test |
|---|
| Selection validation against `PRICE_CATALOG` |
| Server-side total never trusts client-provided total |
| Email length truncation (`.slice(0, 200)`) |
| Date formatting: both dates, only check-in, no dates |

**Effort:** Medium.

### 2.5 Stripe Webhooks — `api/webhooks/stripe.ts` and `supabase/functions/stripe-webhook/index.ts`

**Risk:** Payment status updates are the source of truth. A bug here means lost payments.

| What to test |
|---|
| Signature verification: invalid signature returns 400 |
| `checkout.session.completed`: updates `payment_status` to `paid` |
| `checkout.session.async_payment_failed`: updates to `failed` |
| Missing `application_id`: fallback lookup by `stripe_session_id` |
| Missing application entirely: returns 200 (prevents Stripe retry storm) |
| Amount conversion: `amount_total / 100` for deposit amount |
| Confirmation email sent on success |

**Effort:** Medium-high. Two separate implementations (Vercel + Supabase Edge) need testing.

---

## Priority 3: Frontend Components (Component/Integration Tests)

### 3.1 AuthGuard — `src/components/AuthGuard.tsx`

**Risk:** Incorrect routing based on membership status could expose member-only content or lock out valid members.

| What to test |
|---|
| No user session: redirects to `/login` |
| `requireAdmin=true` + non-admin user: redirects to `/en` |
| Member with `active` status: renders children |
| Member with `pending` status: redirects to `/pending-approval` |
| `no_application` status: redirects to `/request-access` |
| RPC error: redirects to `/request-access` |

**Effort:** Medium. Requires mocking Supabase auth + RPC, React Router.

### 3.2 BookingCalendar — `src/components/BookingCalendar.tsx`

| What to test |
|---|
| Minimum stay validation: < 2 nights shows error toast |
| Unauthenticated user: shows "Please sign in" error |
| Successful submission: calls `booking-inquiry` edge function, shows success toast, closes dialog |
| Dates before tomorrow are disabled |

**Effort:** Medium-high. UI component with async logic.

### 3.3 WaitlistModal — `src/components/WaitlistModal.tsx`

| What to test |
|---|
| Honeypot: filled honeypot silently prevents submission |
| Success state: shows deposit CTA with correct URL params |
| Form reset on close (after 300ms delay) |
| Conditional fields: date picker shown only for `day-pass`, `retreat`, `stay` intents |

**Effort:** Medium.

### 3.4 RequestQuoteForm — `src/components/RequestQuoteForm.tsx`

| What to test |
|---|
| Honeypot prevents submission |
| Success state renders confirmation message |
| Error state shows retry message |
| Language detection from `navigator.language` |

**Effort:** Low-medium.

---

## Priority 4: Supabase Edge Functions (Integration Tests)

### 4.1 Newsletter Signup — `supabase/functions/newsletter-signup/index.ts`

| What to test |
|---|
| New subscriber: added to Resend audience + welcome email sent |
| Existing subscriber (409): no welcome email, still returns success |
| Waitlist upsert failure is non-blocking |
| `firstName` truncated to 100 chars |
| Missing `RESEND_API_KEY` or `RESEND_AUDIENCE_ID` throws |

### 4.2 Rate Limit Helper — `api/lib/rate-limit.ts`

| What to test |
|---|
| `checkRateLimit()` returns correct type for each limiter (`waitlist`, `corporate`, `partner`, `guide`) |
| Minutes-until-reset message formatting (singular vs plural) |
| Correct limiter selected per type |

---

## Priority 5: Data Integrity (Snapshot/Schema Tests)

### 5.1 Static Data — `src/data/packages.ts`, `cities.ts`, `journals.ts`, `retreats.ts`

| What to test |
|---|
| All packages have required fields (no missing `id`, `name`, `price`, etc.) |
| No duplicate package IDs |
| `PRICE_CATALOG` in `send-guest-inquiry.ts` stays in sync with frontend data |
| Image paths reference files that exist in `/public/images/` |

### 5.2 i18n Translation Coverage

| What to test |
|---|
| All keys in `en/` translations exist in `pt/` translations |
| No empty translation values |
| Inline translations (like in `send-waitlist-email.ts`) match keys used |

---

## Recommended Test Framework Setup

Given the stack (Vite + React + TypeScript), the recommended setup is:

```
vitest                          # Test runner (native Vite integration)
@testing-library/react          # Component testing
@testing-library/jest-dom       # DOM matchers
@testing-library/user-event     # User interaction simulation
msw                             # API mocking (Mock Service Worker)
```

### Suggested `package.json` additions:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "vitest": "^3.x",
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "msw": "^2.x",
    "@vitest/coverage-v8": "^3.x",
    "jsdom": "^25.x"
  }
}
```

### Suggested directory structure:

```
src/
  lib/
    __tests__/
      revenue-engine.test.ts       # Priority 1.1
  hooks/
    __tests__/
      useBookedDates.test.ts       # Priority 1.3
      useBlockedDates.test.ts      # Priority 1.4
  components/
    __tests__/
      AuthGuard.test.tsx           # Priority 3.1
      BookingCalendar.test.tsx     # Priority 3.2

api/
  __tests__/
    create-checkout-session.test.ts  # Priority 2.1
    send-guest-inquiry.test.ts       # Priority 2.4
    stripe-webhook.test.ts           # Priority 2.5

tests/
  data-integrity.test.ts            # Priority 5.1
  i18n-coverage.test.ts             # Priority 5.2
```

---

## Where to Start (Top 5 Quick Wins)

1. **`revenue-engine.ts` unit tests** — Pure functions, zero mocking, high business value. Can be done in under an hour.
2. **`useBlockedDates.ts` parsing logic** — Extract and test the response-parsing branch. 30 minutes.
3. **`PRICE_CATALOG` validation in `send-guest-inquiry.ts`** — Extract selection validation into a pure function and test it. 45 minutes.
4. **Data integrity snapshot tests** — Verify all packages have required fields, no duplicate IDs. 30 minutes.
5. **`AuthGuard` routing logic** — High-impact, protects the entire member area. 1-2 hours with mocking.

---

## Security-Sensitive Areas That Need Tests

| Area | File | Risk |
|---|---|---|
| HTML escaping in emails | `esc()` in multiple API routes | XSS in email clients |
| Email validation regex | `send-waitlist-email.ts:59` | ReDoS or bypass |
| Stripe signature verification | Both webhook handlers | Payment spoofing |
| CORS origin allowlist | All API routes | Cross-origin attacks |
| Rate limiting | `api/lib/rate-limit.ts` | Abuse/DDoS |
| Input truncation | `.slice(0, 200)` in `send-guest-inquiry.ts` | Buffer/field overflow |
