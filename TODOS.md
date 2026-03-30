# TODOS — Alpine Silence Members Area

## Deferred Delight Items (Post-v1)

### 1. Seasonal Hero Rotation
- **Priority:** P2 | **Size:** S (~30 min)
- **What:** Dashboard hero image changes based on Swiss season (snow/alpenglow Dec-Mar, wildflowers Jun-Aug, golden larches Sep-Nov, green alps Apr-May)
- **Why:** Reinforces the "private magazine printed just for you" feeling. Members see a living, breathing product — not a static dashboard.
- **How:** Simple `new Date().getMonth()` check → pick from 4 hero images. No API needed.

### 2. Skeleton Loading States
- **Priority:** P2 | **Size:** S (~20 min)
- **What:** Animated placeholder shapes that match the final layout while data loads.
- **Why:** Avoids the flash-of-nothing that breaks the luxury feel. Makes the app feel instant.
- **How:** Tailwind `animate-pulse` on placeholder divs matching each section's shape.

### 3. Smooth Page Transitions (framer-motion)
- **Priority:** P2 | **Size:** S (~30 min)
- **What:** Fade/slide transitions between member pages using framer-motion.
- **Why:** The "unhurried" editorial feel the Alpine Silence design system demands. Hard page cuts break the magazine illusion.
- **How:** Wrap routes in `<AnimatePresence>` with fade+slide variants. New dependency: `framer-motion`.

### 4. Time-Aware Greeting
- **Priority:** P2 | **Size:** S (~5 min)
- **What:** "Good morning, Julian" / "Good evening, Julian" based on local time.
- **Why:** Tiny detail that makes the member feel seen. Luxury is in the details.
- **How:** `new Date().getHours()` → morning/afternoon/evening string.

### 5. "Your Next Journey" Countdown Card
- **Priority:** P2 | **Size:** S (~20 min)
- **What:** If the member has an upcoming booking, show a hero card with destination photo + "Begins in 14 days".
- **Why:** Transforms the dashboard from a booking list into an anticipation builder.
- **How:** Query bookings table for next confirmed booking with `check_in > now()`, compute day diff.

### 6. Extract WhatsApp Number to Shared Constant
- **Priority:** P3 | **Size:** S (~10 min)
- **What:** Move `+41787002202` to `src/lib/constants.ts` and import everywhere.
- **Why:** Number is hardcoded in 6+ files. If it changes, find-and-replace is error-prone.
- **How:** Create `export const WHATSAPP_NUMBER = "41787002202"` and `getWhatsAppUrl(text: string)` helper.

### 7. Structured Package Tags for Personalization
- **Priority:** P2 | **Size:** M (~1 hour)
- **What:** Add `tags: string[]` to `PackageData` (e.g., `["music", "culture", "winter"]`). Use tags for curations scoring instead of free-text keyword matching.
- **Why:** Current scoring matches preference text against descriptions via regex — works but fragile. Tags enable proper filtering on the Explore page too.
- **How:** Add tags to each package in `packages.ts`. Update Dashboard scoring to match against tags. Optionally wire Explore filters to use tags instead of duration/availability heuristics.

---

## Future Vision (Phase 2+)

- **Curator relationship** — Named curator per member, shown on journey pages
- **Discovery engine** — "Because you loved Vals, you'd love..." recommendations
- **Journey stories** — Post-trip photo journals with curator notes
- **Silent Mode** — Privacy toggle (needs `silent_mode` column on members table)
- **Weather widget** — Real-time Swiss weather on dashboard (needs external API)
- **Member community** — "3 members visiting Zermatt this weekend" (privacy-respecting)
