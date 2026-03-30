# Swissperiences — Platform Flow & Technical Documentation v2.0

**Prepared for:** Pascal
**Date:** March 5, 2026
**Author:** Caueh Vidal, Founder & Technical Lead
**Previous version:** v1.1 (February 2026)

---

## 1. Executive Summary

Swissperiences is a membership-based luxury travel platform for Switzerland operating a **dual business model**: curated alpine experiences for invite-only members, and short-term rental property management in Geneva. The platform is a fully custom Vite + React + TypeScript SPA (not Lovable.dev — 100% custom code) backed by Supabase PostgreSQL, Vercel serverless functions, Stripe payments, and Resend transactional emails.

**Live at:** [swissperiences.ch](https://swissperiences.ch)
**Domain registrar:** Infomaniak (registered through 2029)

---

## 2. Dual Business Model

### 2.1 Experience Curation (Primary)

Invite-only luxury travel platform offering curated alpine experiences across Switzerland. Members apply for access, receive approval, and can book packages, standalone experiences, and sanctuary stays through a private dashboard.

Revenue streams: package bookings, standalone experiences, retreat deposits, guest upsells (Airbnb), GetYourGuide affiliate commissions.

### 2.2 Property Management (New in v2.0)

Short-term rental management targeting Geneva properties. Commission-based model at 15–25% of rental revenue, operating within Switzerland's 90-night/year regulatory limit. Properties are tracked in the `admin_inventory` table with per-property management fee rates and pillar scores.

Current inventory pipeline:

| Property | Location | Status | Mgmt Fee | Pillar Score |
|----------|----------|--------|----------|-------------|
| Villars Sky Loft | Villars-sur-Ollon | Active | 30% | 5/5 |
| Verbier Sanctuary | Verbier | Scouting | 35% | 5/5 |
| Zermatt Glass House | Zermatt | Scouting | 35% | 4/5 |

---

## 3. Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vite 5 + React 18 + TypeScript 5.8 | SPA, code-split with React.lazy |
| UI Components | shadcn/ui (Radix primitives) | Dark-mode-first design system |
| Styling | Tailwind CSS 3.4 + tailwindcss-animate | Custom luxury design tokens |
| Fonts | Inter (body), Lora (serif headlines) | Loaded via Google Fonts |
| Animation | Framer Motion 12 | Page transitions, micro-interactions |
| Routing | React Router v6 | Lazy-loaded, bilingual (en/pt) |
| State | TanStack React Query 5 | Server state caching |
| Forms | React Hook Form 7 + Zod 3 | Schema-validated forms |
| SEO | react-helmet-async | Per-page meta tags |
| i18n | i18next + i18next-http-backend | EN/PT, URL-driven (`/:lang`) |
| Toasts | Sonner + Radix Toast | Dual notification system |
| Database | Supabase PostgreSQL | Project: `rhoxismvcalqppbnndew` (West EU) |
| Auth | Supabase Auth | Google OAuth + Email/Password |
| Edge Functions | Supabase (Deno runtime) | 7 functions deployed |
| API Routes | Vercel Serverless (Node.js) | 5 endpoints + 1 helper |
| Payments | Stripe | Checkout Sessions (CHF/GBP) |
| Email | Resend | From: hello@swissperiences.ch |
| Rate Limiting | Upstash Redis | Per-IP throttling |
| Analytics | Plausible | GDPR-compliant, no cookies |
| Affiliates | GetYourGuide | Partner ID: XJZ4DP0, 10 destinations |
| Hosting | Vercel (Hobby plan) | 100 deploys/day shared |

---

## 4. Website Structure & Routing

React Router v6 with a **dual-route pattern**: every public page exists at both `/path` and `/:lang/path`. The `<LanguageWrapper>` component syncs the URL `:lang` parameter with i18next in real-time.

### 4.1 Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Homepage — hero, sanctuary preview, request quote form |
| `/sanctuaries` | Sanctuaries | Accommodation listings |
| `/sanctuaries/villars` | Villars Retreat | Flagship sanctuary at 1,300m |
| `/packages` | Packages | 4 tiered packages (solo/couple/group pricing) |
| `/experiences` | Experiences | 4 standalone bookable experiences |
| `/experiences/road-journey` | Road Journey | Alps Road Journey (CHF 850) |
| `/experiences/cinematic-memories` | Cinematic Memories | Drone filming + 4K reel (CHF 600) |
| `/experiences/private-chef` | Private Chef | In-chalet dining (CHF 400) |
| `/experiences/guided-hikes` | Guided Hikes | Alpine guided hikes (CHF 300) |
| `/journals` | Journals | Guest stories (3 published) |
| `/journals/:slug` | Journal Post | Individual guest narrative |
| `/destinations` | Destinations | 10 Swiss destinations hub |
| `/destinations/:slug` | Destination Page | City page + GetYourGuide activities |
| `/for-teams` | For Teams | Corporate retreat inquiries |
| `/partnerships` | Partnerships | B2B partnerships page |
| `/about` | About | Company story |
| `/contact` | Contact | Contact form |
| `/sustainability` | Sustainability | Environmental commitment |
| `/privacy` | Privacy | Privacy policy |
| `/terms` | Terms | Terms of service |
| `/request-access` | Request Access | Membership application form |
| `/apply` | Apply | Alias for `/request-access` |
| `/login` | Login | Google OAuth + Email/Password |
| `/secure-deposit` | Secure Deposit | Retreat deposit info page |
| `/success` | Success | Post-payment confirmation |

### 4.2 Protected Pages (AuthGuard — requires auth + active membership)

| Route | Page | Description |
|-------|------|-------------|
| `/members` | Members | Member dashboard |
| `/members/book` | Members Book | Booking interface (calendar + add-ons) |
| `/members/profile` | Members Profile | Profile editing |

### 4.3 Admin Pages (AuthGuard + requireAdmin)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/gallery` | Admin Gallery | Mission Control (partners, inventory, bookings, tasks) |
| `/members/links` | Link Generator | Guest proposal link generator |
| `/ideas` | Ideas | Internal ideas board |
| `/todo` | ToDo | Task management |

### 4.4 Special / Utility Pages

| Route | Page | Description |
|-------|------|-------------|
| `/auth/callback` | Auth Callback | OAuth redirect handler |
| `/pending-approval` | Pending Approval | Post-application waiting page |
| `/enhance` | Guest Enhance | Airbnb guest upsell page |
| `/invite/:code` | Invite Page | Personalized invite links |
| `/private/alex-proposal` | Alex Proposal | Custom client proposal |

### 4.5 Legacy Redirects

| Old Route | New Route |
|-----------|-----------|
| `/villars-retreat` | `/sanctuaries/villars` |
| `/road-journey` | `/experiences/road-journey` |
| `/cinematic-memories` | `/experiences/cinematic-memories` |
| `/admin` | `/admin/gallery` |

---

## 5. Packages & Pricing (March 2026)

### 5.1 Curated Packages

| Package | Duration | Solo | Couple | Group | Season |
|---------|----------|------|--------|-------|--------|
| **The Alpine Reset** | 3 nights | CHF 1,200 | CHF 1,800 | CHF 2,400 (1-4 pax) | Year-round |
| **The Winter Escape** | 4 nights | CHF 1,600 | CHF 2,500 | CHF 3,200 (1-4 pax) | Dec – Mar |
| **The Cinematic Weekend** | 2 nights | CHF 950 | CHF 1,500 | CHF 2,000 (1-4 pax) | Apr – Nov |
| **The Grand Tour** | 5 nights | CHF 3,000 | CHF 4,500 | CHF 5,500 (1-6 pax) | Year-round |

**Inclusions:**

- **Alpine Reset**: Sanctuary Loft, guided alpine hike, thermal spa session, welcome aperitif, curated dining recommendations
- **Winter Escape**: Sanctuary Loft, 2-day ski pass, thermal baths, fondue evening, Swiss wine pairing, ski rental available as add-on
- **Cinematic Weekend**: Sanctuary Loft, professional drone filming, half-day road journey, edited 4K highlight reel
- **Grand Tour**: Sanctuary Loft, 2-day road journey across 3 cantons, 2 premium dining experiences, guided alpine hike, drone filming, thermal spa, welcome aperitif

### 5.2 Standalone Experiences

| Experience | Price | Category |
|-----------|-------|----------|
| Alps Road Journey | CHF 850 | Private guide + luxury SUV |
| Cinematic Memories | CHF 600 | Drone + photography + edited 4K reel |
| Private Chef Evening | CHF 400 | In-chalet dining (add-on) |
| Guided Alpine Hike | CHF 300 | Alpine hiking with certified guide |

### 5.3 Guest Extras (Airbnb Upsell via /enhance)

| Extra | Price | Category |
|-------|-------|----------|
| Early Check-in (10:00) | CHF 50 | Extra |
| Late Check-out (14:00) | CHF 50 | Extra |
| Station Transfer | CHF 80 | Extra |
| Welcome Package | CHF 75 | Extra |

### 5.4 Retreats

**The Spring Intake** — May 12–19, 2026 (Villars-sur-Ollon)

| Tier | Price |
|------|-------|
| Signature Cohort | CHF 14,500 |
| Basecamp | CHF 3,500 |
| Deposit (refundable 60 days prior) | CHF 500 |

---

## 6. 10 Destinations

All destination pages include curated highlights, related experiences/sanctuaries/journals, GetYourGuide affiliate activities, and SEO metadata.

| Destination | Altitude | Highlight |
|-------------|----------|-----------|
| Geneva | 375m | Gateway city, jazz, lakeside sophistication |
| Villars-sur-Ollon | 1,300m | Home sanctuary, year-round alpine |
| Verbier | 1,500m | World-class skiing, Sanctuary 02 planned for 2027 |
| Zermatt | 1,620m | Matterhorn, car-free village, Sanctuary 03 planned for 2028 |
| Interlaken | 568m | Bernese Oberland gateway (Eiger, Mönch, Jungfrau) |
| Lauterbrunnen | 795m | Valley of 72 waterfalls, cinematic filming location |
| Montreux | 390m | Swiss Riviera, Jazz Festival, Lavaux vineyards |
| Lausanne | 495m | Olympic capital, EPFL hub, Lavaux gateway |
| Lucerne | 436m | Medieval Chapel Bridge, Pilatus & Rigi access |
| Grindelwald | 1,034m | Eiger North Face, First & Männlichen cable cars |

---

## 7. Authentication Flow

### 7.1 Google OAuth (Primary)

```
User clicks "Login with Google"
  → Supabase redirects to Google consent screen
  → Google redirects back to /auth/callback
  → onAuthStateChange listener fires
  → Calls get_or_create_member() RPC
  → Routes by membership status:
      active         → /members
      pending        → /pending-approval
      no_application → /request-access
```

### 7.2 Email/Password (Secondary)

```
User enters email + password on expandable form at /login
  → signInWithPassword() to Supabase Auth
  → Same get_or_create_member() RPC routing
```

### 7.3 AuthGuard Component

Wraps all protected routes. Checks:
1. `auth.getUser()` — is user authenticated?
2. `get_or_create_member()` RPC — what's their membership status?
3. `is_admin()` RPC — if route has `requireAdmin` flag, checks `admin_emails` table

Admin access is email-based: the `admin_emails` table whitelists specific email addresses.

---

## 8. Database Schema (Supabase PostgreSQL)

29 migrations applied. Key tables:

### 8.1 Core Tables

**membership_applications** — Application pipeline

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | Auto-generated |
| full_name | TEXT NOT NULL | |
| email | TEXT NOT NULL UNIQUE | |
| city, country | TEXT | |
| reason | TEXT | Why they want to join |
| referral_source | TEXT | linkedin, friend, google, other |
| referral_detail | TEXT | |
| status | TEXT | pending / approved / rejected / waitlist |
| reviewed_by | TEXT | Admin who reviewed |
| reviewed_at | TIMESTAMPTZ | |
| admin_notes | TEXT | |
| payment_status | TEXT | pending / paid / failed / refunded |
| stripe_session_id | TEXT | |
| paid_at | TIMESTAMPTZ | |
| deposit_amount | DECIMAL | |
| created_at | TIMESTAMPTZ | |

**members** — Active member profiles

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| auth_user_id | UUID FK → auth.users | One-to-one |
| full_name, email | TEXT | |
| avatar_url | TEXT | |
| city, country | TEXT | |
| membership_tier | TEXT | founding / standard / vip |
| membership_status | TEXT | active / paused / cancelled |
| joined_at | TIMESTAMPTZ | |
| last_login_at | TIMESTAMPTZ | |
| total_bookings | INTEGER | |
| total_spent | DECIMAL(10,2) | |

**bookings** — Member reservations

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| member_id | UUID FK → members | |
| sanctuary_id | TEXT | villars, verbier, zermatt |
| experience_type | TEXT | road_journey, guided_hike, cinematic_memories, private_chef |
| check_in, check_out | DATE | |
| preferred_date | DATE | For standalone experiences |
| guests | INTEGER | |
| special_requests | TEXT | |
| status | TEXT | inquiry / confirmed / cancelled / completed |
| total_nights | INTEGER | |
| estimated_price | NUMERIC | |

**waitlist** — Pre-launch / newsletter subscribers

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| email | TEXT UNIQUE | |
| newsletter_opt_in | BOOLEAN | Default true |
| stripe_session_id | TEXT | Checkout tracking |
| payment_status | TEXT | |

### 8.2 Admin Tables

**admin_emails** — Admin user whitelist (email-based access control)

**admin_inventory** — Property / sanctuary management

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | Property name |
| location | TEXT | City/region |
| pillar_score | INTEGER | 1-5 quality rating |
| management_fee_rate | DECIMAL(5,2) | Default 30% |
| nightly_rate_base | DECIMAL(10,2) | |
| status | TEXT | scouting / active / maintenance / inactive |
| owner_info | JSONB | Flexible owner details |

**admin_partners** — Curation network / vendor management

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | Partner name |
| service_type | TEXT | Private Chef, Mountain Guide, Logistics |
| commission_rate | DECIMAL(5,2) | Default 20% |
| base_cost_estimate | TEXT | |
| region | TEXT | |
| ethos_verified | BOOLEAN | Vetted for quality standards |
| contact_details | JSONB | |
| last_service_date | DATE | |

**admin_tasks** — Internal task tracking

**admin_concepts** — Content ideas pipeline

### 8.3 Other Tables

**blocked_dates** — Calendar availability management (UNIQUE constraint on type + item_id + date)

**corporate_inquiries** — B2B retreat / team event leads with status tracking (new / in-review / quoted / completed)

### 8.4 RLS Policies

- Anonymous users can INSERT into `membership_applications` and `waitlist`
- Authenticated users can view their own member profile, create/update own bookings
- Admin access (via `is_admin()` RPC) grants full CRUD on all tables
- All policies use `DROP POLICY IF EXISTS` before `CREATE POLICY` for idempotent migrations

### 8.5 Key RPC Functions

- `get_or_create_member()` — Matches auth user to member record or creates pending entry
- `is_admin()` — Checks if current user's email exists in `admin_emails` table

---

## 9. API Routes (Vercel Serverless — Node.js)

### 9.1 POST `/api/create-checkout-session`

Creates a Stripe Checkout Session for retreat deposits.

**Inputs:** `email` (required), `tier`, `intent`, `application_id` (optional), `marketing_opt_in`

**Flow:**
1. Lookup waitlist entry by email (if no application_id provided)
2. Create Stripe Checkout Session — CHF 500 (auto-detects GBP if tier contains '£')
3. Update waitlist with stripe_session_id
4. Sync to Resend audience if opted-in
5. Return checkout URL

### 9.2 POST `/api/webhooks/stripe`

Handles Stripe webhook events.

**Event:** `checkout.session.completed`

**Flow:**
1. Verify webhook signature
2. Update `waitlist`: payment_status → 'paid', store stripe_customer_id
3. Send payment confirmation email via Resend

### 9.3 POST `/api/send-inquiry-email`

Corporate team retreat inquiry form handler.

**Inputs:** `companyName`, `contactName`, `email` (required), `teamSize`, `message`, `newsletter_opt_in`

**Rate limit:** 3 requests / 10 minutes (Upstash Redis)

**Flow:**
1. Save to `corporate_inquiries` table
2. Send user confirmation email
3. Delay 1.1s (Resend rate limit)
4. Send admin notification to hello@swissperiences.ch
5. Delay 1.1s
6. Sync to Resend audience (if opted-in)

### 9.4 POST `/api/send-guest-inquiry`

Airbnb guest upsell — processes selections from `/enhance` page.

**Inputs:** `guestName`, `guestEmail` (required), `selections` (array of {id, quantity}), `checkIn`, `checkOut`, `notes`

**Server-side price catalog (source of truth):**

```
road_journey:       CHF 850  (experience)
guided_hike:        CHF 300  (experience)
cinematic_memories: CHF 600  (experience)
private_chef:       CHF 400  (experience)
early_checkin:      CHF  50  (extra)
late_checkout:      CHF  50  (extra)
transfer:           CHF  80  (extra)
welcome_package:    CHF  75  (extra)
```

**Flow:**
1. Validate selections server-side (never trusts client totals)
2. Send admin notification with itemized breakdown
3. Delay 1.1s
4. Send guest confirmation with formatted receipt

### 9.5 POST `/api/send-waitlist-email`

Newsletter / waitlist signup handler.

**Inputs:** `email` (required), `first_name`, `newsletter_opt_in`, `tier`, `intent`, `season`, `start_date`, `end_date`, `num_guests`, `message`, `language`

**Rate limit:** 5 requests / 10 minutes

**Language support:** EN (default), PT (Portuguese)

**Flow:**
1. Insert to `waitlist` table (returns 200 on duplicate email — graceful handling)
2. Send welcome email (i18n based on language param)
3. Delay 1.1s → Send admin notification
4. Delay 1.1s → Sync to Resend audience (if opted-in)

### 9.6 Rate Limiting Helper (`api/lib/rate-limit.ts`)

Upstash Redis-backed per-IP rate limiting. Returns `{ success: true }` or `{ success: false, error: "Too many requests..." }`.

---

## 10. Supabase Edge Functions (Deno Runtime)

### 10.1 `newsletter-signup`

Adds subscriber to Resend audience + sends welcome email. Called via direct `fetch()` with hardcoded JWT anon key (not supabase-js — see Section 14.1 for why).

### 10.2 `notify-application` (Database Trigger)

Fires on `INSERT` into `membership_applications`. Sends "Thank You" email to applicant + admin notification with "Open Admin Panel" link.

### 10.3 `send-approval-email`

Admin-triggered function to send "You're In" membership approval email with login CTA.

### 10.4 `send-booking-confirmation`

Admin-triggered function to send booking confirmation with details.

### 10.5 `booking-inquiry`

Member-initiated booking inquiry handler.

### 10.6 `create-checkout`

Deno-runtime alternative for Stripe checkout session creation.

### 10.7 `stripe-webhook`

Deno-runtime alternative for Stripe webhook handling.

---

## 11. Email System (Resend)

All emails sent from: **hello@swissperiences.ch** (hosted on Google Workspace Business Standard / Gmail)

| Trigger | Email | Recipient |
|---------|-------|-----------|
| New application | "Thank you for applying" | Applicant |
| New application | Admin notification | hello@swissperiences.ch |
| Application approved | "You're in" + login CTA | Member |
| Newsletter signup | Welcome email | Subscriber |
| Deposit paid | Payment confirmation | Customer |
| Guest inquiry (Airbnb) | Itemized breakdown | Guest |
| Guest inquiry (Airbnb) | Admin alert | hello@swissperiences.ch |
| Corporate inquiry | Confirmation | Company contact |
| Corporate inquiry | Admin alert | hello@swissperiences.ch |
| Waitlist signup | Welcome (EN or PT) | Subscriber |
| Auth (signup, reset) | System emails | User |

**Rate management:** Resend enforces 2 req/sec — all multi-email flows include 1.1-second delays between sends.

---

## 12. Revenue Engine

Located in `src/lib/revenue-engine.ts`. Calculates pricing with margin-preserving formula:

```
guestPrice = baseCost / (1 - marginRate)
```

**Default rates:**

- Property management fee: **30%** (configurable per property in admin_inventory)
- Experience curation markup: **20%** (configurable per partner in admin_partners)

**Example:** Base cost CHF 100, 20% margin → Guest price = CHF 125, Commission = CHF 25

**Helper functions:**
- `calculateGuestPrice(baseCost, marginRate)` → final price
- `calculateCommission(guestPrice, feeRate)` → commission amount
- `formatCurrency(amount, currency)` → "CHF 125" or "£125"
- `getRevenueBreakdown(baseCost, marginRate)` → complete breakdown object

---

## 13. Integrations Summary

| Service | Purpose | Config |
|---------|---------|--------|
| **Stripe** | One-time deposits (CHF 500 / GBP), webhook verification | API keys in Vercel env |
| **Resend** | Transactional emails + newsletter audience management | API key in Vercel + Supabase env |
| **Supabase** | PostgreSQL, Auth, Edge Functions, RLS | Project `rhoxismvcalqppbnndew`, West EU |
| **Upstash Redis** | Per-IP rate limiting on API routes | REST URL + token in Vercel env |
| **Plausible** | Privacy-first analytics (no consent banner needed) | Script tag in index.html |
| **GetYourGuide** | Affiliate links on 10 destination pages | Partner ID: XJZ4DP0 |
| **Google Workspace** | Business email (hello@swissperiences.ch via Gmail) | Business Standard, 1 seat, CHF 2.92/mo |
| **Google OAuth** | Primary authentication method | Via Supabase Auth provider |
| **i18next** | Bilingual support (EN/PT) | Translations in `/public/locales/{en,pt}/` |
| **Framer Motion** | Page transitions, micro-interactions | React component library |

---

## 14. Technical Quirks & Notes

### 14.1 Newsletter Signup Direct Fetch

`src/lib/newsletter.ts` uses direct `fetch()` with a hardcoded Supabase anon JWT key instead of the supabase-js client. This is intentional: the `sb_publishable_*` key from Vercel env vars works with supabase-js but returns 401 when used as a raw `Authorization: Bearer` header for edge function calls.

### 14.2 Resend Rate Management

All multi-email flows include explicit `await delay(1100)` calls between sends to stay within Resend's 2 req/sec limit.

### 14.3 Dual Serverless Layers

Both Vercel (Node.js) and Supabase (Deno) handle Stripe and email operations. The Vercel routes are the primary production endpoints; the Supabase edge functions serve as the Deno-native alternative and handle database-triggered events.

### 14.4 Code Splitting

Every route in `App.tsx` is lazy-loaded via `React.lazy()` + `<Suspense>` with a minimal dark-themed loader fallback.

---

## 15. Security Configuration

### 15.1 Headers (vercel.json)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### 15.2 Content Security Policy

Default-src restricted to self. Scripts allowed from Plausible and Google Fonts. Connect-src includes Supabase project URL and Stripe API. Frame-ancestors set to none.

### 15.3 CORS

All `/api/*` routes allow cross-origin requests with standard methods (GET, POST, PUT, DELETE, OPTIONS) and headers (Content-Type, Authorization).

---

## 16. Deployment

| Component | Platform | Notes |
|-----------|----------|-------|
| Frontend + API | Vercel (Hobby plan) | 100 deploys/day shared across team |
| Database + Auth + Edge Functions | Supabase | Project `rhoxismvcalqppbnndew`, West EU |
| Domain | Infomaniak | swissperiences.ch, registered through 2029 |
| Email | Google Workspace Business Standard | 1 seat, CHF 2.92/mo (incl. IVA) — Mastercard •••• 0749 |

**Development commands:**

```bash
vercel dev                    # Full local dev (frontend + API) on port 3000
npm run dev                   # Frontend only (Vite on port 8080, no API routes)
npm run build                 # Production build
npm run lint                  # ESLint (flat config)
```

**Important:** `npm run dev` does NOT serve `/api/*` routes. Use `vercel dev` for full-stack local development.

---

## 17. Journals (Published Guest Stories)

| Title | Guests | Date | Route |
|-------|--------|------|-------|
| The Winter Ascent | Wagner, Andreia & Helena | Feb 2024 | Geneva → Lavaux → Grindelwald → Lauterbrunnen → Blausee |
| The Alpine Protocol | Ale & Alex | Mar 2024 | Geneva → Mont Salève → alpine ridges → peak state |
| The Return | Leo | Oct 2025 | Lake Brienz → Aare Gorge → Lauterbrunnen → autumn colors |

---

## 18. What Changed Since v1.1 (February 2026)

| Change | Details |
|--------|---------|
| **Platform origin** | Confirmed as fully custom Vite/React/TypeScript (not Lovable.dev) |
| **Property management** | Added as second business vertical (Geneva short-term rentals) |
| **Package pricing** | Updated — solo pricing starts at CHF 950 (Cinematic Weekend) |
| **Grand Tour** | Private chef replaced with 2 premium dining experiences |
| **Winter Escape** | Reduced from 4-day to 2-day ski pass; ski rental now add-on |
| **10 destination pages** | New pages with GetYourGuide affiliate integration |
| **Packages page** | New `/packages` route with tiered solo/couple/group pricing |
| **Revenue engine** | New `revenue-engine.ts` with commission calculations |
| **Admin system** | Added partners management, inventory tracking, task management |
| **Guest enhance** | New `/enhance` page for Airbnb guest experience upsell |
| **Journals** | 3 guest stories published with narrative-driven design |
| **Retreats** | The Spring Intake (May 2026) with Signature/Basecamp tiers |
| **Schema.org** | Structured data corrected across all pages |
| **Sustainability page** | New `/sustainability` route |
| **Partnerships page** | New `/partnerships` route for B2B |
| **Member profiles** | New `/members/profile` with editable fields |
| **Link generator** | New `/members/links` for admin guest proposal links |

---

*Document version: 2.0 — March 5, 2026*
*Next scheduled update: When significant architecture changes occur*
