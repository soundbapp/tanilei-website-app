# Tani/Lei — The Beauty Experience

Next.js landing page for Tani/Lei luxury beauty (Dallas, TX).

## Get running

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Images

The three hero/about/kit images are already in `/public/images/`:

- `hero_hair.png`
- `tani_headshot.png`
- `kit_mockup.png`

They were extracted from the original HTML. If you replace them, keep the same filenames or update references in `components/Hero.tsx`, `components/About.tsx`, and `components/Kit.tsx`.

## Build

```bash
npm run build
npm start
```

## Booking calendar

Guests see Tani's calendar on the homepage booking section and at `/appointments`.
Days she is fully booked stay visible (rose, struck through). The calendar starts
with Tani booked until **November 10, 2026** (one month from October 10, 2026).

Tani can change that at `/tani` (also linked as **Staff** in the footer):

1. Set `TANI_ADMIN_PASSWORD` and `TANI_SESSION_SECRET` in the environment.
2. Sign in at `/tani/login`.
3. Move the “booked until” date, or click weekdays to open/close them.

If Postgres is configured (`DATABASE_URL`), settings are stored there (apply
`db/migrations/003_calendar.sql` or `npm run migrate:003`). Otherwise they are
saved to `data/calendar-settings.json` (local/dev).

## What's included

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, Google Fonts (Great Vibes, Cormorant Garamond, Montserrat), metadata |
| `app/page.tsx` | Assembles all sections in order |
| `components/Nav.tsx` | Fixed nav, hamburger, mobile menu, sticky CTA + IntersectionObserver on `#book` |
| `components/Hero.tsx` | Hero with hair image, badge, overlay |
| `components/Ticker.tsx` | Infinite scrolling service bar |
| `components/Services.tsx` | 6-card grid with holo hover |
| `components/About.tsx` | Tani photo (upper-left), name card (bottom-right, 55% width, no overflow clip) |
| `components/Experience.tsx` | 4-step dark section |
| `components/Kit.tsx` | Features list + kit image |
| `components/AppSection.tsx` | Feature grid + phone mockup |
| `components/Booking.tsx` | Email form with success state |
| `components/Footer.tsx` | 3-column footer + bottom bar |
| `styles/globals.css` | CSS variables, `holo-shift` keyframes, utilities |

Section IDs `#services`, `#about`, `#experience`, `#kit`, `#app`, `#book` are preserved for anchor links and the sticky CTA visibility (hidden when `#book` is in view).
