# Tani/Lei — Next.js App

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Images

Place these three files in `/public/images/` before running:

| File | Source |
|------|--------|
| `hero_hair.png` | Hero section background (hair mockup) |
| `tani_headshot.png` | About section — Tani's portrait |
| `kit_mockup.png` | Kit section — product box mockup |

These were originally embedded as base64 in the HTML. Extract them from `tanilei-landing.html` or use the original uploaded files.

---

## File Structure

```
/app
  layout.tsx          ← Root layout, fonts, metadata
  page.tsx            ← Assembles all sections

/components
  Nav.tsx             ← Fixed nav, hamburger, mobile menu, sticky CTA
  Hero.tsx            ← Full-screen hero with hair image
  Ticker.tsx          ← Infinite scrolling service ticker
  Services.tsx        ← 6-card service grid
  About.tsx           ← Tani photo (upper-left) + name card (bottom-right)
  Experience.tsx      ← 4-step dark section
  Kit.tsx             ← Kit features + product image
  AppSection.tsx      ← App features + phone mockup
  Booking.tsx         ← Email capture form with submit state
  Footer.tsx          ← 3-column footer + bottom bar

/styles
  globals.css         ← CSS variables, holo animation, shared utilities

/public/images
  hero_hair.png
  tani_headshot.png
  kit_mockup.png
```

---

## Design System

All colors are CSS custom properties in `globals.css`:

```css
--rose-gold:  #C9A99A
--rose-light: #E8D5CC
--rose-pale:  #F5EDE8
--rose-deep:  #A07060
--cream:      #FAF6F3
--dark:       #2A1F1A
--text:       #3D2B22
--text-light: #7A5C50
```

**Fonts:** Montserrat (body) · Cormorant Garamond (headings) · Great Vibes (logo/script)

**Holo animation:** `.holo` class — applied to badge, phone screen, experience background, booking background. 8s infinite gradient shift. Do not change.

---

## Key Implementation Notes

### About section layout
Photo is `position: absolute, top: 0, left: 0, width: 78%, height: 80%` with `z-index: 1`.
Card is `position: absolute, bottom: 0, right: 0, width: 55%` with `z-index: 2`.
Container is `position: relative, height: 560px` with **no** `overflow: hidden` — this allows the card to overlap the photo corner intentionally.

### Sticky mobile CTA
Uses `IntersectionObserver` on `#book`. When the booking section enters the viewport, the sticky bar fades out. Implemented in `Nav.tsx` via `useEffect`.

### Anchor links
All section IDs must stay: `#services` `#about` `#experience` `#kit` `#app` `#book`

---

## Deployment

```bash
npm run build
npm run start
```

Or deploy to Vercel — just connect the repo, zero config needed.
