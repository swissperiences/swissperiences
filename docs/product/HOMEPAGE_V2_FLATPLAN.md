# Homepage v2 — flatplan

Companion to `docs/audits/SWISSPERIENCES_SITE_AUDIT_2026-07.md`. Nothing here is
implemented.

## The strategic question

Swissperiences is being built as a parent brand with five lines:

| Line | What it is | Status today |
|---|---|---|
| **STAY** | Alpine Sanctuaries | live — Villars is the flagship |
| **EXPERIENCE** | Private Journeys | live inside the packages |
| **LISTEN** | Audio Journeys | built, currently on a separate branch |
| **REMEMBER** | Journals & Cinematic Memories | live as content |
| **MY SWISSPERIENCES** | Guest Dashboard & Concierge | partially built at `/members` |

The homepage today presents exactly one of these and names it in the hero:
"PRIVATE ALPINE CLUB — VILLARS-SUR-OLLON, 1,300M". Villars is not the brand.
Villars is the first flagship. The site currently makes the opposite claim.

### On "The art of doing nothing, beautifully"

It is the best line on the site — and it is a **Sanctuary** line, not a parent-brand
line. It promises stillness, which is precisely right for a chalet at 1,300m and
precisely wrong for a road journey, an audio walk through Geneva, or a drone
session. Adopting it as the umbrella headline quietly commits the whole brand to
one of its five products.

Recommendation: keep it, demote it. It becomes the headline of the Villars
flagship section and of the Alpine Sanctuaries campaign. The parent brand needs
a line that can hold stillness *and* motion.

### Decided — the umbrella hero

```
kicker      PRIVATE SWISS JOURNEYS
headline    Switzerland, made personal.
subtext     Alpine sanctuaries, private journeys and stories shaped
            around the way you travel.
primary     EXPLORE SWISSPERIENCES
secondary   REQUEST A PRIVATE JOURNEY   (discreet)
```

Villars leaves the main hero entirely. "The art of doing nothing, beautifully"
survives inside the Villars Loft section or page.

The headline works because it names a category rather than a mood: *made
personal* survives a chalet, a road journey, an audio walk and a drone session,
where *doing nothing* survives only the first.

## Critique of the candidate flatplan

The proposed nine-section plan, assessed section by section.

| # | Proposed | Verdict | Reasoning |
|---|---|---|---|
| 1 | Umbrella-brand hero | **Adopt** | fixes the central defect |
| 2 | Stay / Experience / Listen / Remember | **Adopt, with care** | four-up is right; must not read as a SaaS feature grid. Editorial, one image each, no icons |
| 3 | Flagship Sanctuary — Villars | **Adopt** | where "the art of doing nothing" belongs |
| 4 | Three Signature Journeys | **Adopt** | replaces the eight-package grid; three is curation, eight is a menu |
| 5 | Audio Journeys preview | **Adopt, but gate on readiness** | do not advertise a product that cannot be bought or heard. Needs a playable sample; otherwise defer |
| 6 | Guest stories | **Adopt, move up** | should sit before My Swissperiences: proof precedes invitation |
| 7 | My Swissperiences preview | **Adopt** | the single biggest missing piece — makes membership a benefit, not a gate |
| 8 | The Host | **Adopt** | founder-hosted is the actual differentiator |
| 9 | One final CTA | **Adopt** | ends the nine-way CTA fight |

### Where I would change it

**Missing: the quote form.** The plan drops the highest-intent element on the
site. "One final CTA" should *be* the quote form, not a link to one.

**Missing: the Insider Guide.** A working lead magnet for people not ready to
enquire. Move it to the footer or an exit-intent slot — off the main spine, not
deleted.

**Section 5 is the weak link.** Audio Journeys is on a separate branch and there
is no purchase path. Advertising it on the homepage before it can be consumed
repeats the mistake the whole restore was undoing. Ship it as section 5 only
when there is a playable preview and a destination.

**Section 2 carries the most risk.** Four pillars presented badly become a
generic services grid and destroy the editorial voice — the brand's main asset.
It must look like a magazine contents page, not a pricing table.

## Recommended flatplan

Target: **8–9 viewports**, down from 17.2.

| # | Section | Purpose | ~Height | CTA |
|---|---|---|---|---|
| 1 | **Umbrella hero** | what Swissperiences is | 1.0 vp | one primary |
| 2 | **Four pillars** — Stay / Experience / Listen / Remember | the brand is bigger than a chalet | 1.2 vp | none (anchors) |
| 3 | **Flagship — Villars** | "the art of doing nothing, beautifully" | 1.3 vp | Discover the Sanctuary |
| 4 | **Three Signature Journeys** | curated, not a menu | 1.5 vp | View all journeys |
| 5 | **Guest stories** | proof, with faces and provenance | 1.0 vp | none |
| 6 | **My Swissperiences preview** | membership as benefit | 1.0 vp | See what members get |
| 7 | **The Host** | founder-hosted trust | 0.8 vp | none |
| 8 | **Audio Journeys** *(conditional)* | only when playable | 0.8 vp | Listen to a chapter |
| 9 | **Final CTA — the quote form** | convert | 1.0 vp | Start a conversation |

CTA budget: **one primary per section, maximum four on the page.** Today: 25.

### What each section inherits

| New section | Reuses |
|---|---|
| 1 | existing hero video component, authenticated-variant logic |
| 2 | new — needs one image per pillar |
| 3 | current Sanctuary full-bleed block, largely as-is |
| 4 | `PackagesPreview`, filtered to three |
| 5 | current guest quotes block, plus faces |
| 6 | new — screenshot of the real dashboard |
| 7 | current Founder block, plus photograph |
| 8 | new — depends on the audio branch |
| 9 | current `RequestQuoteForm`, unchanged |

### What leaves the homepage

- **Location Log** (~917 px) → About or Journals
- **"For those who"** manifesto (~920 px) → About
- **Insider Guide** (~556 px) → footer or exit intent
- **Trust bar** (57 px) → fold into the hero
- **Five of eight packages** → the packages index page

Nothing is deleted. It moves off the main spine.

## Decisions taken — 2026-07-28

**1. Umbrella headline.** Decided; see the hero block above. Villars is out of
the main hero.

**2. Audio Journeys — not on the homepage yet.** The bar is a complete path a
person can walk: discover → buy or redeem → start → listen → finish. Until all
five exist, it lives in the roadmap and may appear in the Journal, but never as
a commercial pillar. A product announced without delivery weakens the brand more
than its absence does. Section 8 does not ship.

**3. "Sanctuaries" goes singular.** One real property means the plural promises
a collection the visitor cannot find. Use **STAY** as the pillar label and
**SANCTUARY** where a place is meant. The plural returns when a second sanctuary
is contractually real, not merely intended.

**4. Guest quote assets** — still open; needs guest permission for faces and dates.

With Audio Journeys deferred and the headline fixed, the shipping flatplan is
**eight sections**, not nine. Target remains 8–9 viewports.
