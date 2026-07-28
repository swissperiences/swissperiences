# Swissperiences — site audit, July 2026

Source of truth: **production at `https://swissperiences.ch`**, audited 2026-07-28.
Measurements are from the live DOM and the Performance API, not from the repository.

This supersedes the April 2026 conversion notes. Several things called missing
back then now exist: there are CTAs, there are guest quotes, there is a quote
form, prices exist behind login. The problems today are different ones.

## Visual evidence

**Desktop, anonymous, above the fold.** Full-bleed river video. Headline "The art
of doing nothing, *beautifully*." Two competing buttons — solid white "EXPLORE
PACKAGES" and outlined "SIGN IN" — then, in 9px grey caps, "PRIVATE ALPINE CLUB
— VILLARS-SUR-OLLON, 1,300M".

**Desktop, authenticated.** A different hero video (a photographer at sunrise),
a single CTA "ENTER MEMBER AREA", and "MY ACCOUNT" replacing "SIGN IN". The
logged-in homepage is a genuinely different, and better, page: one CTA instead
of two. Nobody seems to have noticed this variant exists.

**Mobile (375×812).** The qualifier line is dropped entirely. The two CTAs stack
vertically, pushing everything below 1.5 viewports. Roughly 85% of the first
screen is image with no text on it.

## Measured facts

| Metric | Desktop | Mobile |
|---|---|---|
| Document height | 12,408 px | 15,152 px |
| Viewports of scroll | **17.2** | **18.7** |
| `<section>` count | 13 | 13 |
| Packages block alone | **3,307 px — 27% of the page** | — |
| Horizontal overflow | none | none |
| Text nodes under 12px | — | **71 of 191** |
| Text nodes under 10px | — | **29** (nav is 9px) |
| Touch targets under 44px | — | **37** |

| Weight | Value |
|---|---|
| Total transfer | 6,948 KB |
| **Images** | **6,522 KB (94%)** |
| Scripts | 131 KB |
| CSS | 24 KB |
| Requests | 60 |
| DOM interactive | 514 ms |
| Load event | 2,497 ms |

| SEO / i18n | Value |
|---|---|
| `<title>` | 51 chars — good |
| Meta description | 166 chars — trim to <160 |
| `og:image`, canonical | present |
| `hreflang` alternates | 6 |
| JSON-LD blocks | 3 |
| `<h1>` / `<h2>` | 1 / 6 — correct outline |
| Images without `alt` | **0** |

## Diagnosis

### P0 — credibility damage, fix before anything else

**1. Four of eight packages advertise dead seasons.** Live on the page today
(28 July): `TULIP FESTIVAL` (Morges, April–May), `PRIDE EDITION` (June),
`OPENS APR`, and `MJF SPOTLIGHT` (Montreux Jazz ended 18 July). A luxury brand
selling last April's tulips in late July reads as abandoned. This is the single
most expensive detail on the site and it costs nothing to fix.

**2. The umbrella brand is collapsed into one chalet.** The homepage hero of
*Swissperiences* declares "PRIVATE ALPINE CLUB — VILLARS-SUR-OLLON, 1,300M".
Every strategic ambition — Experience, Listen, Remember, a second sanctuary —
is contradicted in the first five seconds. See the strategy section below.

**3. "REQUEST A QUOTE" appears nine times.** Eleven distinct CTA labels compete:
Explore Packages, Sign In, Discover, Request a Quote ×9, View All Packages,
Get the free guide, Read Story ×4, Send Request, Apply for Membership ×2,
Insider Guide. Nine identical asks is not persistence, it is noise — the reader
learns to ignore the button.

**4. 6.5 MB of images.** 94% of page weight, on a page that is 17 viewports
long. Nothing else in the stack is heavy: scripts are 131 KB. Convert to
AVIF/WebP with responsive `srcset` and lazy-load everything below the second
viewport.

### P1 — structural

**5. The page is 17 viewports long.** Nobody reaches the final CTA. The packages
grid alone is 27% of it.

**6. Eight packages presented as a flat grid.** Eight equally-weighted options is
a menu, not curation — and it contradicts "we don't sell experiences, we curate".
Three signature journeys plus a "view all" link would say the opposite and be
truer to the brand.

**7. Mobile typography is below the legibility floor.** 29 nodes under 10px, the
entire nav at 9px. 37 touch targets under the 44px minimum.

**8. Two heroes, one unused.** The authenticated hero already solves the
competing-CTA problem. The anonymous hero should learn from it.

### P2 — refinement

**9. Meta description at 166 chars** will truncate in results.
**10. "Villars" and "Sanctuary" used interchangeably**, so the reader cannot tell
whether Sanctuary is a place, a product line, or a mood.
**11. The Insider Guide** (a lead magnet) sits between packages and testimonials,
interrupting the consideration path with a different ask.
**12. Journals, Location Log and "For those who"** are three consecutive
editorial blocks totalling ~2,800 px with no commercial function.

### P3 — polish

**13.** Hero video has no poster frame; on a slow connection the first paint is
black.
**14.** `EN | PT` toggle sits at 9px in the nav, easy to miss for the Brazilian
audience that is a stated priority.
**15.** No `prefers-reduced-motion` handling on the scroll reveals.

## Scores

| Dimension | Score | Note |
|---|---|---|
| Brand clarity | **4/10** | umbrella brand reads as one chalet |
| First 5 seconds | 5/10 | beautiful, but what is sold is unclear |
| Conversion path | 5/10 | one ask repeated 9×, no ranking |
| Content freshness | **2/10** | four dead seasonal packages |
| Rhythm / length | 3/10 | 17 viewports |
| Mobile | 4/10 | no overflow, but 9px type, 37 small targets |
| Accessibility | 5/10 | alt text complete, type and contrast are not |
| Performance | 3/10 | 6.5 MB of images |
| SEO / i18n | **8/10** | genuinely well done |
| Social proof | 6/10 | four real quotes, no faces, no provenance |

## Top 10 changes

1. Remove or re-label every expired seasonal package.
2. Replace the Villars-specific hero line with an umbrella-brand promise.
3. Reduce the homepage to one primary CTA per section; cut "Request a Quote"
   from nine instances to two.
4. Compress AVIF/WebP + `srcset` + lazy-load — target under 1.5 MB.
5. Cut the eight-package grid to three signature journeys with a "view all".
6. Bring the homepage from 17 viewports to 8–9.
7. Raise the mobile type floor to 12px, nav to 14px.
8. Enlarge touch targets to 44px.
9. Introduce Stay / Experience / Listen / Remember as the brand's four pillars.
10. Add a My Swissperiences preview so membership shows a benefit, not a gate.

## Quick wins — under an hour each

- Delete the four dead seasonal badges.
- Trim the meta description to 158 chars.
- Bump the mobile nav from 9px to 14px.
- Add a poster frame to the hero video.
- Drop "Request a Quote" from the package cards, keep it in the form section.

## Do not change

- **SEO and i18n.** 6 hreflang alternates, canonical, 3 JSON-LD blocks, complete
  alt text, correct heading outline. This is the strongest part of the site.
- **The typographic voice.** Lora headlines over full-bleed film is genuinely
  distinctive and is the brand's main asset.
- **"We don't sell experiences. We curate the art of doing nothing."** The best
  sentence on the page.
- **Prices behind login.** A deliberate, defensible mechanic — not a bug.
- **The four guest quotes.** Real and specific; keep the words, add provenance.
- **The authenticated hero.** Already correct.
- **The member area shell.** Auth, layout, routing and booking all work.

## Missing content and assets

- Photography for a second sanctuary — without it, "Alpine Sanctuaries" (plural)
  cannot be shown, only claimed.
- Guest faces or trip photos for the quotes; anonymous text reads as invented.
- An Audio Journeys preview asset for the homepage.
- Founder photograph and a short bio — "The Host" is the trust anchor and is
  currently thin.
- Compressed derivatives of every hero image.
- A My Swissperiences screenshot for the logged-out preview.
