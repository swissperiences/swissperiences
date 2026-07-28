# My Swissperiences — guest dashboard

**This is not greenfield.** A working member area already exists: authentication,
layout, routing, booking, a seasonal dashboard, curations, a countdown and a
concierge CTA. The work is an evolution and a rename, not a rebuild.

Nothing here is implemented.

## What exists today

| Route | File | Lines | State |
|---|---|---|---|
| `/members` | `MembersDashboard.tsx` | 550 | greeting, countdown (`daysUntil`), seasonal logic, curations, WhatsApp concierge CTA |
| `/members/book` | `MembersBook.tsx` | 704 | booking calendar, blocked dates, inquiry submission |
| `/members/explore` | `MembersExplore.tsx` | 559 | curated content browsing |
| `/members/profile` | `MembersProfileNew.tsx` | 318 | administrative profile only |
| `/members/links` | — | — | utility route |
| `/enhance` | `GuestEnhance.tsx` | 344 | public add-on upsell — spa, transfers |
| shell | `MembersLayout.tsx` | 193 | 4-item nav: Dashboard, Compass, Calendar, User |

**2,324 lines of working product.** Language-prefixed routes (`/:lang/members/…`)
already exist, so the member area is bilingual by construction.

Data access is thin and clean: the `bookings` table and one RPC,
`get_member_profile`. `AuthGuard` gates every route and checks membership status
via `get_or_create_member`.

### The `members` table

`id`, `auth_user_id`, `full_name`, `email`, `avatar_url`, `city`, `country`,
`membership_tier`, `membership_status`, `joined_at`, `updated_at`.

Eleven columns, **zero of them about travel**. This is a CRM record. That single
fact is why the profile feels administrative — the schema never had anywhere to
put a preference.

## Proposed structure

Five sections, mapped onto what exists.

| New | Replaces | Verdict |
|---|---|---|
| **Overview** | `/members` | refactor — the shell is right, the content needs ranking |
| **My Journey** | new, absorbs parts of `/members/book` | create |
| **Explore** | `/members/explore` | keep, retitle |
| **Concierge** | the WhatsApp CTA on the dashboard | promote to a section |
| **My Profile** | `/members/profile` | refactor into a Travel Profile |

### Overview — refactor

Keep the greeting, the countdown and the seasonal logic; they are the warmest
part of the product and no SaaS dashboard has them. What it needs is a clear
answer to "what happens next": next booking, what is outstanding, one
suggested action. Today it presents curations before status.

### My Journey — create

The gap. A guest with a confirmed stay has nowhere to see it as a *journey* —
only a booking record. This is where arrival details, the itinerary, add-ons
from `/enhance`, and afterwards the Journal and cinematic memories live. It is
what makes the dashboard worth opening twice.

Absorbs the booking history from `MembersBook`, which keeps its calendar for
*new* requests.

### Explore — keep

`MembersExplore` (559 lines) works. Retitle only. It is the natural home for
Audio Journeys when that line lands.

### Concierge — promote

There is one WhatsApp CTA on the dashboard. For a founder-hosted brand, the
concierge *is* the product; it deserves a surface — message history, request
templates, response expectations. Start with what exists (WhatsApp deep link)
and grow.

### My Profile → Travel Profile

See below.

## What to remove or rename

**"Members" → "My Swissperiences"** across nav and titles. "Members area" is a
portal; "My Swissperiences" is a possession.

### `/members/links` → `/admin/guest-links` — decided

Not a member surface at all. The route is
`<AuthGuard requireAdmin><LinkGenerator /></AuthGuard>` — an operations tool that
produces a personalised `/enhance` link, a ready-to-send message for an Airbnb
guest, and a Villars Loft reference.

Move it to `/admin/guest-links`, display name **Guest Link Generator**, and keep
a temporary redirect from `/members/links` so existing bookmarks survive. It
belongs to host operations, not to My Swissperiences.

### `/enhance` — hybrid, and it needs a token

Conceptually it belongs inside My Journey. Technically it must stay reachable by
public link, because Airbnb guests are not members. It must not appear in the
public brand navigation.

**The current link design leaks personal data.** `GuestEnhance` reads four
parameters straight from the query string:

```ts
searchParams.get("guest")     // name
searchParams.get("email")     // direct personal identifier
searchParams.get("checkin")
searchParams.get("checkout")
```

So a real link carries a guest's name, email address and stay dates in the URL.
That URL lands in browser history, in forwarded WhatsApp messages, in
screenshots, and in Vercel access logs.

One mitigation already exists and should be stated accurately rather than
overstated: `vercel.json` sets `Referrer-Policy: strict-origin-when-cross-origin`,
so cross-origin requests send only the origin. The query string does **not** leak
to Mapbox, Plausible or image hosts. The exposure is the link itself, wherever it
travels.

Target design:

```
/enhance/<opaque-token>
```

The token resolves to the guest record server-side. No name, no email, no dates
in the URL. Tokens should expire — a stay-scoped lifetime is the obvious bound —
and be revocable.

This is a privacy fix, not a feature. It should be scheduled independently of the
dashboard work.

## Travel Profile

The current profile collects `full_name`, `phone`, `city`, `country`. That is
enough to invoice someone and nothing else.

**Do not build one large form.** A luxury guest will not complete a 14-field
questionnaire, and a half-filled profile is worse than none — it produces
confident wrong assumptions.

### Progressive disclosure

| Stage | When | Asks |
|---|---|---|
| **1 — Essentials** | on approval | name, phone, languages, arrival style |
| **2 — Comfort** | on first booking | allergies, food preferences, accessibility, room & sleep |
| **3 — Character** | before arrival | travel pace, interests, activity level, companions, occasion |
| **4 — Consent** | before arrival | photography & drone, privacy, communication preferences |

Each stage is three to five fields, asked when it is obviously relevant.
Stage 2 is asked when the guest already wants something — the moment they are
most willing to answer.

### Field assessment

| Field | Keep | Note |
|---|---|---|
| Allergies | **yes** | safety-critical; the one field that must be structured and never free-text-only |
| Food preferences | yes | structured, multi-select |
| Accessibility | yes | ask plainly, never infer |
| Languages | yes | already core to a bilingual brand |
| Room & sleep preferences | yes | firm/soft, high/low floor, quiet |
| Arrival style | yes | drives the transfer offer directly |
| Special occasions | yes | highest-value field for a host — birthdays, anniversaries |
| Companions | yes | party composition; children change everything |
| Travel pace | yes | but as two or three options, not a slider |
| Interests | yes | max 5 from a fixed list |
| Activity level | **merge** | fold into travel pace; they are the same axis |
| Photography & drone consent | **yes, and legally required** | must be explicit, revocable, timestamped — the brand sells cinematic memories |
| Privacy | yes | who may appear in published content |
| Communication preferences | yes | channel and frequency |

### Concepts to reject or rework

**"Elite Member" — reject.** It flatters the wrong instinct. A brand whose line
is "the art of doing nothing" does not need status vocabulary; the exclusivity is
already in the invitation. Tiering also creates an expectation of a lower tier,
which does not exist.

**"Aesthetic Profile" — rework.** The intent is right, the framing is
unanswerable. Nobody can rate their own aesthetic. Get it from behaviour instead:
what they saved, what they booked, which journals they read.

**"Temperamental preferences" — reject as a field, keep as an outcome.** This is
what a host learns, not what a guest declares. It belongs in host notes, not in
the guest's form.

**"Member tier" — defer.** It already exists as a column. Leave it as internal
metadata; do not surface it until there is a second tier that means something.

## Explicitly not this

Not a SaaS dashboard. No KPI cards, no progress rings, no gamification, no
"profile 60% complete" nag. The reference is a well-kept guest book — the same
Lora-over-photography voice as the public site. If it looks like Notion, it is
wrong.

## Sequence

1. Rename Members → My Swissperiences; restructure the nav to five items.
2. Refactor Overview to lead with status.
3. Travel Profile stage 1 + the schema to hold it.
4. My Journey.
5. Travel Profile stages 2–4.
6. Concierge as a section.
7. Homepage preview block (flatplan section 6).

Steps 1–2 are cosmetic and safe. Step 3 needs a migration and is the first real
piece of work.
