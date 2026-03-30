# Audit Report — Technical Documentation v2.0

**Date:** March 5, 2026
**Scope:** Cross-reference of `Swissperiences_Technical_Documentation_v2.html` and `technical-snapshot-v2.md` against the live codebase
**Verdict:** Good foundation, but **12 issues found** (3 errors, 4 missing sections, 5 improvements)

---

## ERRORS & INACCURACIES

### 1. Property Management Fee — Wrong Percentage Range
**Location:** HTML Section 2.2, MD Section 2.2
**Document says:** "Commission-based model at 15–25% of rental revenue"
**Codebase reality:** The property table in the SAME document lists 30% (Villars) and 35% (Verbier/Zermatt). The `revenue-engine.ts` default is `DEFAULT_INVENTORY_FEE = 0.30` (30%).
**Fix:** Change "15–25%" to "30–35%" or "starting at 30%"

### 2. Missing Routes in HTML
**Location:** HTML Section 5.1 (Public Pages)
The HTML document omits 4 routes that exist in `App.tsx`:

| Route | Page | In MD? | In HTML? |
|-------|------|--------|----------|
| `/privacy` | Privacy Policy | ✅ | ❌ |
| `/terms` | Terms of Service | ✅ | ❌ |
| `/apply` | Alias → /request-access | ✅ | ❌ |
| `/success` | Post-payment confirmation | ✅ | ❌ |

### 3. `lovable-tagger` in devDependencies
**Location:** `package.json` line 68
**Document says (MD):** "not Lovable.dev — 100% custom code"
**Reality:** `lovable-tagger: ^1.1.13` is listed as a dev dependency. While this is just a build/dev tool (not the platform generator), it contradicts the "100% custom code" claim and could confuse Pascal.
**Fix:** Either remove the dependency or add a clarification note in the docs.

---

## MISSING SECTIONS (HTML vs MD)

### 4. No "Technical Quirks & Notes" Section
The MD has Section 14 covering 4 important architectural quirks:
- Newsletter signup uses direct `fetch()` with hardcoded JWT (not supabase-js)
- Resend 2 req/sec rate management with 1.1s delays
- Dual serverless layers (Vercel Node.js + Supabase Deno)
- Code splitting via `React.lazy()` on every route

These are important for any developer who touches the codebase. **Add as Section 14.5 or new section in HTML.**

### 5. No Journals Section
The MD has Section 17 documenting 3 published guest stories:

| Title | Guests | Date | Route |
|-------|--------|------|-------|
| The Winter Ascent | Wagner, Andreia & Helena | Feb 2024 | Geneva → Lavaux → Grindelwald |
| The Alpine Protocol | Ale & Alex | Mar 2024 | Geneva → Mont Salève → alpine ridges |
| The Return | Leo | Oct 2025 | Lake Brienz → Aare Gorge → Lauterbrunnen |

These exist in `src/data/journals.ts` with full narrative data. **Add to HTML.**

### 6. No Legacy Redirects Section
The MD has Section 4.5 and `vercel.json` confirms 3 permanent (301) redirects:

| Old Route | New Route | Type |
|-----------|-----------|------|
| `/villars-retreat` | `/sanctuaries/villars` | 301 |
| `/road-journey` | `/experiences/road-journey` | 301 |
| `/cinematic-memories` | `/experiences/cinematic-memories` | 301 |

Plus in `App.tsx`: `/admin` → Navigate to `/admin/gallery`

### 7. Missing Admin Table Schemas
The MD documents `admin_inventory` (8 columns) and `admin_partners` (10 columns) in detail. The HTML just lists them as "Property/sanctuary mgmt" and "Curation network" without column details. These are critical for understanding the revenue engine.

---

## IMPROVEMENTS

### 8. Images Are Decorative, Not Screenshots
**Current:** The "Platform Visual Overview" section uses 6 hero/stock images from the site (`villars-sunrise.jpg`, `caueh-vidal-spring.jpg`, etc.)
**Problem:** These are decorative photography, not actual UI screenshots. Pascal might expect to see the actual interface (nav bar, package cards, booking flow, admin panel).
**Fix:** Either relabel as "Brand Photography" or replace with actual page screenshots when possible.

### 9. No Architecture Diagram
A visual diagram showing the flow between Frontend → Vercel API → Supabase → Stripe → Resend would be extremely useful for Pascal to understand the system at a glance. Even a simple text-based diagram would help.

### 10. No Environment Variables Documentation
The codebase requires ~12 env vars across Vercel and Supabase:
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `VITE_STRIPE_PUBLISHABLE_KEY`

None of these are documented. **Add an "Environment & Secrets" section.**

### 11. No File Structure Overview
A high-level directory tree would orient Pascal:
```
src/
├── components/     # UI components (AuthGuard, ScrollToTop, ErrorBoundary, ui/)
├── data/           # Static data (packages, cities, journals, retreats)
├── hooks/          # Custom React hooks
├── i18n/           # i18next configuration
├── integrations/   # Supabase client & auto-generated types
├── lib/            # Utilities (revenue-engine, newsletter, utils)
├── pages/          # Route pages (lazy-loaded)
├── App.tsx         # Router & providers
└── index.css       # Tailwind + design tokens
api/                # Vercel serverless functions
supabase/
├── functions/      # 7 Deno edge functions
└── migrations/     # 29 SQL migrations
```

### 12. CSP Details Missing
The `vercel.json` has a detailed Content-Security-Policy but the HTML just says "CSP restricts sources to self + Plausible + Google Fonts + Supabase + Stripe." The actual CSP also includes `unsafe-inline`, `unsafe-eval` for scripts, `data:` and `https:` for images, and `http://localhost:3000` for connect-src (dev). Worth documenting fully.

---

## SUMMARY

| Category | Count | Severity |
|----------|-------|----------|
| Factual errors | 3 | 🔴 Fix now |
| Missing sections | 4 | 🟡 Add when possible |
| Improvements | 5 | 🟢 Nice to have |

**Priority fixes:**
1. ❌ Fix the "15-25%" → "30-35%" property management fee
2. ❌ Add missing routes (/privacy, /terms, /apply, /success)
3. ❌ Address lovable-tagger contradiction
4. ⚠️ Add Technical Quirks section (critical for developers)
5. ⚠️ Add Journals section
6. 💡 Add architecture diagram + file structure + env vars

---

*Audit performed by cross-referencing HTML/MD against: App.tsx, package.json, vercel.json, src/data/*.ts, api/*.ts, src/lib/revenue-engine.ts, src/lib/newsletter.ts, src/components/AuthGuard.tsx, supabase/migrations/, supabase/functions/*
