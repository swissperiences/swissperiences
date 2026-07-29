# Frontend brand alignment — implementation record

Branch: `feat/frontend-brand-alignment` · Implemented 2026-07-28.
Companion to `docs/audits/SWISSPERIENCES_SITE_AUDIT_2026-07.md` and
`docs/product/HOMEPAGE_V2_FLATPLAN.md`. This document records what was
actually built, what was preserved, and what was deliberately left for later.

## Homepage architecture (src/pages/Index.tsx)

The 13-section, ~15-viewport homepage was replaced with the nine-section
flatplan. Section order:

| # | Section | Component | Notes |
|---|---|---|---|
| 1 | Umbrella hero | inline in `Index.tsx` | video kept; new copy (below) |
| 2 | The four worlds | `home/WorldsSection.tsx` | magazine-contents rows, not cards |
| 3 | Flagship sanctuary | `home/FlagshipSanctuary.tsx` | "art of doing nothing" lives here now |
| 4 | Three signature journeys | `home/SignatureJourneys.tsx` | date-aware selection, editorial rows |
| 5 | Audio Journeys preview | `home/AudioJourneysPreview.tsx` | Stones & Water, static route visual |
| 6 | Guest stories | `home/GuestStories.tsx` | 1 featured + 2 supporting, real journals |
| 7 | My Swissperiences preview | `home/MySwissperiencesPreview.tsx` | "prepared note", not a dashboard mock |
| 8 | The host | `Founder.tsx` (reused) | unchanged apart from shared context |
| 9 | Final CTA + quote form | inline + `RequestQuoteForm` (embedded mode) | the form *is* the final CTA |

### Copy decisions

- Hero eyebrow `Private Switzerland, personally hosted`, headline
  `Switzerland, personally curated.`, support line and both CTAs exactly as
  specified. Primary scrolls to the worlds section; secondary routes to
  `/members` (logged in) or `/login`.
- `The art of doing nothing, beautifully.` was demoted to the Villars
  flagship section (section 3), per the flatplan.
- `We don't sell experiences. We curate the art of doing nothing.` kept, as
  the statement bridging worlds → flagship.
- Final CTA heading `Start with Switzerland. We'll curate the rest.`; the
  quote form submit button is now the single `Start a conversation` primary.
- CTA budget: "Request a Quote" went from 9 instances to 1 (the form
  heading). No competing Apply/Join/Explore/Discover primaries remain on the
  homepage spine.

### What left the homepage (moved, not deleted)

- **Trust bar** — removed from the spine (component deleted; the hero
  eyebrow now carries "personally hosted").
- **Insider Guide block** — already linked in the footer; the homepage
  section was removed.
- **"For those who" manifesto** — relocated to `/about` (between Values and
  Vision).
- **Journal editorial + quotes carousel** — merged into section 6.
- **Five of eight packages** — remain on `/packages`.

### Removed components

`TrustBar.tsx`, `GuestQuotes.tsx`, `PackagesPreview.tsx` — all became
unreferenced after the rebuild and were deleted (no dead components).
`src/pages/Members.tsx` and `src/pages/MembersProfile.tsx` were already
unrouted legacy before this branch; left untouched (out of scope).

## Package validity (src/lib/packageStatus.ts)

New date-aware utility replacing manual array order + `slice(0, 8)`:

- Statuses: `evergreen` · `in-season` · `out-of-season` · `upcoming-event` ·
  `expired-event`. Event end dates parsed from `eventDates`
  ("3–4 Apr 2026", "27 Mar – 10 May 2026"); unparseable event dates are
  treated as expired so nothing unverifiable gets promoted.
- `getSignatureJourneys(3)` picks the homepage journeys from bookable
  packages only, ranked by an explicit editorial priority list. As of
  2026-07-28 that yields Alpine Reset, Cinematic Weekend, Grand Tour.
- `/packages` now sorts bookable first; expired events sink to the end,
  show a "Past edition — <dates>" badge, dimmed imagery, and an
  "Ask About the Next Edition" CTA instead of a booking CTA.
- Members dashboard: curations pool and the "coming up" nudge now exclude
  expired events (the nudge only shows genuinely upcoming ones).
- Members explore: expired events excluded from the browse grid.
- No package data was deleted or edited; prices and dates untouched.

## Navigation (src/components/Navigation.tsx)

- Public nav: `Stay · Experiences · Audio · Journals · About` (Packages left
  primary nav; it is reachable from the journeys section, footer, and
  Experiences).
- Active states now strip the `/en|/pt` prefix and match nested routes
  (`/journals/slug` marks Journals active).
- Desktop nav raised from 9px to 11px; auth button from 9px to 10px.
- Auth button renamed `My Account` → `My Swissperiences`; localized
  (`nav.mySwissperiences`, `nav.signIn`, `nav.stay`, `nav.audio`).
- No routes were removed; `/sanctuaries`, `/packages` and every legacy
  redirect still resolve.

## Audio Journeys

- New route `/audio` (+ `/:lang/audio`) → `src/pages/AudioJourneys.tsx`.
- Homepage section 5 and the page use only the confirmed facts: Geneva Old
  Town · 7 chapters · 1.9 km · ≈60 minutes · begins at Jardin Anglais.
- Visuals are static: a dashed route line with 7 markers over the Geneva
  aerial, decorative waveform fragments, numbered chapter rows with titles
  explicitly "revealed with the release". No player, no playback claim, no
  purchase claim; status copy says "In production".
- CTA on the page is the existing NewsletterForm ("Be the first to hear
  it") — the only honest conversion for an unreleased product.
- `/Users/cv/swissperiences-audio` was not accessed.

## My Swissperiences (frontend shell only)

- `MembersLayout`: brand line "Member Area" → "My Swissperiences"; nav
  restructured to Overview · My Journey · Explore · Concierge · My Profile.
  `/members/book` stays routable, reached from Overview and My Journey.
  The tier readout in the sidebar footer was replaced (tier stays internal
  metadata).
- **New `/members/journey`** (`MembersJourney.tsx`): real bookings from the
  existing RLS-scoped `bookings` select, shown as upcoming/past timeline.
  Honest empty state; arrival details described as shared personally by the
  host (true today). No fake itineraries.
- **New `/members/concierge`** (`MembersConcierge.tsx`): the real WhatsApp
  deep link and email, message templates as prefilled wa.me links, and the
  existing 48-hour response promise. No fake chat or message history.
- Dashboard: "Complete your aesthetic profile" → "Complete your Travel
  Profile"; SEO titles renamed to "… | My Swissperiences".
- No tables, migrations, RLS, RPCs or auth were touched.

## Travel Profile (MembersProfileNew.tsx)

- "Elite Member" headline, "Aesthetic Profile" and "temperamental
  preferences" language removed. Page is now **Travel Profile**.
- Existing working fields preserved exactly (same `update_member_profile`
  RPC, same six parameters), regrouped as **Essentials** (name, city,
  country, phone) and **How You Travel** (about, preferences & needs — the
  free-text placeholder now prompts for food/allergies, accessibility, pace,
  languages, occasions, since free text is the only storage that exists).
- Future structured stages (1 Essentials / 2 Comfort / 3 Character /
  4 Consent) are documented in the component header; no unsaved controls are
  rendered.
- Tier column removed from the account card ("Since / Status / Contact").

## Design-system alignment

- New `SectionEyebrow` primitive: 11px, 0.3em tracking, white/45 — replaces
  the drift between 9px/10px eyebrows at varying opacities.
- CTA labels standardized at 12px (`text-xs`); metadata labels at 11px.
- Reveal animations unified on the existing `ScrollReveal`
  (0.8s), replacing the homepage's 1.5–2.5s CSS fades.
- `prefers-reduced-motion`: global `MotionConfig reducedMotion="user"` in
  `App.tsx` (covers every framer-motion animation) + new
  `usePrefersReducedMotion` hook — the hero renders the poster image instead
  of autoplaying video, and parallax/smooth-scroll are disabled.
- Member-area typography (Newsreader/Manrope) intentionally NOT unified with
  the public Lora/Inter in this pass — the fonts are declared inline across
  ~2,300 lines of member pages and swapping them safely is a token-refactor
  of its own. Recorded as deferred.

## Localization

- All new public-facing strings live in `public/locales/{en,pt}/home.json`
  (`umbrellaHero`, `worlds`, `flagship`, `journeys`, `listen`, `stories`,
  `myswissperiences`, `finalCta`, `quoteForm`) and
  `common.json` (`nav.stay`, `nav.audio`, `nav.mySwissperiences`,
  `nav.signIn`). English is complete.
- **PT values are my translations and are marked for editorial review** —
  they are natural pt-BR but have not been approved as final marketing copy.
- Fixed: Portuguese sentence inside `en/home.json`
  (`whatWeCurate.footer`) replaced with English.
- Known gaps (pre-existing, documented not fixed): the member area is
  hardcoded English end-to-end (including the two new member pages, which
  follow their siblings' convention); package data
  (`src/data/packages.ts`) and journals data are English-only; `/audio`
  page chrome is localized but the product name "Stones & Water" is
  deliberately unlocalized.

## Verification

Screenshots under the session scratchpad `screenshots/before` (production,
2026-07-28) and `screenshots/after` (dev build) at 1440×900, 1280×800,
1024×768, 768×1024, 430×932, 390×844, 375×667, plus per-section mobile
(390) and desktop scroll captures. Note: stitched full-page PNGs go black
below ~5,500px — a headless-chromium compositing artifact on >10k px
pages; the per-section viewport captures are the reliable evidence.

- `npx tsc --noEmit` clean; `npm run build` passes.
- `npm run lint`: 51 pre-existing problems on baseline and on this branch —
  zero new findings from this work (legacy `any`s, legacy hook deps).
- Measured (dev, 2026-07-29): homepage 12.6 viewports at 1440×900 (was
  14.3 measured / 17.2 in the audit), 16.1 at 390×844 (was 18.1). No
  horizontal overflow at any tested size. Mobile text nodes <12px: 34
  (was 71), all 11px tracked labels; <10px: 3 (was 29). Touch targets on
  rewritten surfaces raised to ≥44px (text links get invisible padding,
  form inputs 44px); footer link density remains below 44px — documented.
- prefers-reduced-motion verified with an emulated capture: instant
  reveals, static hero poster, no parallax.
- `/pt` renders the new PT strings; `/members` unauthenticated redirects
  to `/login`; keyboard focus visible (3px outline) on nav links.
- Authenticated member states were exercised only at the code level (no QA
  account credentials in the repo; no production users were created).
- An independent fresh-context verifier reviewed the diff, the running
  app, and the screenshots against the specification: **no critical or
  major findings**. Its minors, addressed: tablet (768–1023px) hamburger
  opened an `md:hidden` panel — a pre-existing dead-end, fixed to
  `lg:hidden`; a `<dl>` misuse; 7 unused locale keys removed. Its minors,
  accepted and documented: season-badge strings are English on `/pt`
  (package data is EN-only anyway); `MembersJourney` reuses the
  dashboard's existing upcoming/past semantics (undated inquiries stay
  "upcoming", in-progress stays list as past); `getPreviewSrc` and the
  chapter count are each defined in two files.

## Deferred

1. Member-area typography unification (Newsreader/Manrope → Lora/Inter).
2. Member-area localization (entirely EN today).
3. Travel Profile structured stages 1–4 — needs schema migration
   (`members` has no travel columns).
4. Image weight (6.5 MB) — AVIF/WebP conversion pipeline, backlog P0 #4;
   the new homepage renders fewer images but the originals are unchanged.
5. Faces/provenance for guest quotes beyond what journals already hold.
6. Second sanctuary content ("Alpine Sanctuaries" stays plural in name
   only; copy calls Villars "the first flagship" everywhere).
7. PT editorial review of the new locale strings.
8. Unrouted legacy pages `src/pages/Members.tsx`, `src/pages/MembersProfile.tsx`
   (dead before this branch) — candidates for deletion in a cleanup pass.
