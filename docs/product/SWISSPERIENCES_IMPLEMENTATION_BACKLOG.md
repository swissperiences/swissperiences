# Swissperiences — implementation backlog

Derived from the July 2026 audit and the two product documents. Nothing here is
implemented. Ordered by return, not by comfort.

Sizes: **S** under 2h · **M** half a day · **L** 1–3 days · **XL** a week+.

## P0 — this week

| # | Item | Size | Why now |
|---|---|---|---|
| 1 | Remove or re-label the four expired seasonal packages (Tulip, Pride, Opens Apr, MJF) | **S** | The site is selling April's tulips in late July. Cheapest credibility fix available. |
| 2 | Replace the Villars-specific hero qualifier with an umbrella-brand line | **S** once the line exists | The parent brand currently announces itself as one chalet. |
| 3 | Cut "Request a Quote" from 9 instances to 2 | **S** | Nine identical asks train the reader to ignore the button. |
| 4 | Compress images to AVIF/WebP with `srcset`, lazy-load below viewport 2 | **M** | 6.5 MB of 6.9 MB total. Pure mechanical win. |
| 5 | Raise the mobile type floor to 12px, nav to 14px | **S** | 29 nodes under 10px is below the legibility floor. |

Items 1, 3 and 5 are content and CSS only — no architecture, no risk.

## P1 — this month

| # | Item | Size | Depends on |
|---|---|---|---|
| 6 | Cut the 8-package grid to 3 signature journeys + "view all" | **M** | packages index page exists |
| 7 | Build the four-pillar section (Stay / Experience / Listen / Remember) | **L** | one photograph per pillar |
| 8 | Move Location Log, "For those who", Insider Guide off the main spine | **M** | — |
| 9 | Enlarge 37 touch targets to 44px | **S** | — |
| 10 | Rename Members → My Swissperiences, restructure nav to 5 items | **M** | — |
| 11 | Refactor Overview to lead with status, not curations | **M** | #10 |
| 12 | Add faces and provenance to the guest quotes | **S** + assets | guest permission |

After 6–8 the homepage should measure 8–9 viewports. Verify by re-running the
measurement, not by eye.

## P2 — next quarter

| # | Item | Size | Notes |
|---|---|---|---|
| 13 | Travel Profile stage 1 + schema migration | **L** | first item needing a migration; `members` has zero travel columns |
| 14 | My Journey section | **XL** | the biggest gap in the member area |
| 15 | My Swissperiences preview block on the homepage | **M** | needs #10–11 shipped to screenshot |
| 16 | Travel Profile stages 2–4, incl. photography/drone consent | **L** | consent must be explicit, revocable, timestamped |
| 17 | Concierge as its own section | **L** | start from the existing WhatsApp CTA |
| 18 | Trim meta description to <160 chars | **S** | — |
| 19 | Hero video poster frame | **S** | — |
| 20 | `prefers-reduced-motion` on scroll reveals | **S** | — |

## P3 — when the brand is ready

| # | Item | Blocked on |
|---|---|---|
| 21 | Audio Journeys homepage section | a playable preview and a destination |
| 22 | Second Alpine Sanctuary | a second property and photography |
| 23 | Member tier surfacing | a second tier that means something |
| 24 | Behavioural aesthetic profile | enough booking history to infer from |

## Blocked — needs a decision, not engineering

1. **The umbrella headline.** Blocks P0 #2 and the whole flatplan. "The art of
   doing nothing, beautifully" is a Sanctuary line, not a parent-brand line.
2. **Is Audio Journeys advertisable?** Decides whether the homepage has 8 or 9
   sections.
3. **Is there a second sanctuary?** "Alpine Sanctuaries" is plural with one
   location behind it.
4. **`/enhance`: public or inside My Journey?** Do not maintain both.
5. **`/members/links`** — purpose unknown; audit before keeping.

## Missing assets

| Asset | Blocks |
|---|---|
| One photograph per pillar (4) | P1 #7 |
| Guest faces / trip photos | P1 #12 |
| Founder photograph + bio | flatplan section 7 |
| Compressed derivatives of every hero image | P0 #4 |
| Audio Journeys preview clip | P3 #21 |
| Second sanctuary photography | P3 #22 |

## Explicitly not doing

- No SaaS dashboard patterns — no KPI cards, no progress rings, no completion nags.
- No large single Travel Profile form.
- No "Elite Member" vocabulary.
- No Audio Journeys promotion before it is consumable.
- No deletion of the Journals, Location Log or manifesto — they move, they do not die.
- No touching the SEO/i18n layer; it is the strongest part of the site.

## How to verify

Re-run the audit measurements after P0 and P1 and compare against the July 2026
baseline:

| Metric | Baseline | Target |
|---|---|---|
| Viewports (desktop) | 17.2 | ≤ 9 |
| Total transfer | 6,948 KB | ≤ 1,500 KB |
| Distinct CTA labels | 11 | ≤ 5 |
| "Request a Quote" instances | 9 | 2 |
| Mobile nodes under 12px | 71 | 0 |
| Touch targets under 44px | 37 | 0 |
| Expired seasonal packages | 4 | 0 |
