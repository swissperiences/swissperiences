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

---

## Future Vision (Phase 2+)

- **Curator relationship** — Named curator per member, shown on journey pages
- **Discovery engine** — "Because you loved Vals, you'd love..." recommendations
- **Journey stories** — Post-trip photo journals with curator notes
- **Silent Mode** — Privacy toggle (needs `silent_mode` column on members table)
- **Weather widget** — Real-time Swiss weather on dashboard (needs external API)
- **Member community** — "3 members visiting Zermatt this weekend" (privacy-respecting)
