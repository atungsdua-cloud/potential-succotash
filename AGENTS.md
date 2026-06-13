# Honda Dealer Website

React 18 app bootstrapped with Vite, styled with Tailwind CSS 3.

## Commands

| Command | Action |
|---------|--------|
| `npm start` | Dev server + API server concurrently (port 3000 + 3001) |
| `npm run dev` | Vite dev server only (port 3000) |
| `npm run server` | Express API server only (port 3001) |
| `npm test` | Run Vitest (not Jest; `setupFiles` in `vite.config.js`) |
| `npm run build` | Production build to `dist/` |

## Architecture

- `src/context/ThemeContext.jsx` — dark/light mode with `localStorage` persistence
- `src/context/AuthContext.jsx` — admin auth state, JWT token management
- `src/components/ui/` — reusable atoms (Button, Badge, Skeleton, CarCard, SearchBar, FilterBar, StarRating, ThemeToggle)
- `src/components/layout/` — Header (sticky, scroll-aware), Footer, FloatingContact (WhatsApp, Call, BackToTop)
- `src/components/sections/` — Hero, ProductGrid, PromoSection, Keunggulan, KreditSimulation, TestDrive, TradeIn, Testimoni, Berita, Gallery, Contact
- `src/components/admin/` — AdminLogin (login modal), AdminBar (edit mode toggle), InlineEditor (click-to-edit text/images)
- `src/hooks/` — `useScrollAnimation` (IntersectionObserver), `useCountdown`, `useFilter`, `useContent` (API fetch + fallback)
- `src/data/` — Static JSON fallback files (used when API unavailable)
- `server/` — Express.js + SQLite (better-sqlite3) REST API with JWT auth

## API Server

Express on port 3001, auto-proxied by Vite at `/api` in dev mode.
Endpoints: `/api/mobil`, `/api/promo`, `/api/testimoni`, `/api/berita`, `/api/gallery`, `/api/keunggulan`, `/api/settings`, `/api/auth/login`

### Admin Login

Click shield icon (top-left) to open login. Credentials: `admin` / `honda123`.
After login, an admin bar appears at the top with **Mode Edit** toggle.
In edit mode, click any text or image to edit inline. Changes auto-save to SQLite.

## Styling

- Tailwind CSS 3 with `darkMode: 'class'`
- Honda brand red: `#E40521` (available as `honda-red`, `honda-red-dark`, `honda-red-light`)
- Custom utilities: `.container-custom`, `.section-padding`, `.premium-shadow`, `.text-gradient`
- Font: Inter via Google Fonts

## Testing quirks

- jsdom environment — `window.matchMedia` and `IntersectionObserver` are mocked in `src/setupTests.js`
- Tests use `import { expect, test } from 'vitest'` explicitly
- `@testing-library/jest-dom` matchers loaded via `setupFiles`

## Gotchas

- No CI workflows, no lint/typecheck scripts
- `postcss` override was removed from `package.json` to avoid conflict during install
- Images use Unsplash URLs; replace with local assets in production
- Database file `server/database.sqlite` is auto-created and seeded on first run
- Express v5 — middleware/route syntax matches Express 5 API
- `web-vitals` dependency kept for reference but unused
