# IKIGAI — The Royal Map of Purpose

> “Discover what gives your life meaning, energy, connection, and direction.”

A private, practical, accessible web companion inspired by general themes associated with Ikigai (purpose, flow, community, moderation, movement, mindfulness, resilience). **No account. No tracking. No backend.**

- **Repo:** https://github.com/25mss012/ikigai-royal-map
- **Live:** https://ikigai-royal-map.vercel.app

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind CSS · Lucide React · Recharts (lazy) · Zod · localStorage persistence · `next/font` (Cormorant Garamond + Manrope). No paid APIs, DB, auth, AI, or keys. CSS-only motion (respects `prefers-reduced-motion`).

## Features

- Home: hero, 4 lenses, 5-step loop, audiences, 6 tools, responsible-use strip
- Learn: 20 original essays + detail pages (insight / try-today / reflection / caution)
- Assessment: 40 questions (5 dims × 8), 1–5 + “Not sure”, back/next, autosave, pause/resume, review, provisional logic
- Scoring: `avg = sum/n`, `pct = ((avg-1)/4)*100`, `balance = 100-(max-min)`, overall mean; 8 archetypes (temporary labels)
- Results: radar + SVG wheel (with text fallback), strongest/growth/balance, experiments, prompts, print/JSON export, share-safe summary
- Flow Lab: `challengeFit = 5-|difficulty-confidence|`, `flow = (focus+joy+fit)/3`, averages, top activities, settings, weekly trend
- 30-day plan: Explore/Learn/Create/Serve/Connect/Restore/Reflect, done/skip kindly/reschedule, Day-30 synthesis
- Journal: mood/energy/purpose, tags, gratitude/challenge, search/filter, JSON+Markdown export, crisis notice
- Circle: up to 5 (person/group/nature/practice), reciprocity, next intention
- Dashboard: greeting, completion, plan day, prompt, recents, privacy, export/delete-all; rich empty states
- Trust: Privacy, Accessibility settings, Responsible-use & copyright, About, 404

## Routes

`/`, `/about`, `/learn`, `/learn/[slug]` (20), `/assessment`, `/assessment/results`, `/flow`, `/plan`, `/journal`, `/circle`, `/dashboard`, `/privacy`, `/accessibility`, `/responsible-use`, `/sitemap.xml`, `/robots.txt`

## Run locally

Requires Node 20+. This workspace used a portable Node at `D:\PROJECTS\node-portable` (no admin install).

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run typecheck  # tsc --noEmit
npm run build
npm run start
```

## Data storage

Keys `ikigai.v1.*` in `localStorage` (answers, result, flow, journal, plan, circle, prefs). In-memory fallback if blocked. Survives refresh; per-device.

- **Export:** Results JSON · Flow JSON · Journal JSON/Markdown · Dashboard “Export all data”.
- **Delete:** per-item deletes with confirm · Journal “Clear all” · Plan delete · Dashboard “Delete all data”.

## Accessibility

Skip link, landmarks, heading order, focus rings, keyboard-full, 44px targets, labelled errors, no colour-only meaning, chart text tables, decorative SVG hidden, reduced-motion + high-contrast + text-size + light/dark, 200% zoom safe.

## i18n

EN + TA dictionary (`data/translations.ts`), header toggle, assessment/learn/plan core content bilingual, `Intl` dates (`en-GB`/`ta-IN`), logical-property-ready CSS. No RTL language shipped but layout is RTL-ready.

## Testing

- `npm run lint` — must pass (warnings only for imgs)
- `npx tsc --noEmit` — 0 errors
- `npm run build` — static + dynamic routes compile
- Manual: nav, mobile menu, 40Q answer/back/next/refresh/review/submit, provisional case, radar/wheel fallback, flow add/delete, journal CRUD/search/export, plan generate/done/skip/reschedule, circle ≤5, export/delete-all, lang/theme/motion toggles, keyboard-only, 200% zoom, blocked-storage fallback, print, 404, no console errors.
- Copyright audit: `*.pdf` ignored; no book text Grep hits.

See CHANGELOG.md. Known limits: single-device storage; TA covers core strings (essay bodies EN, full Tamil in progress); Recharts lazy — table fallback offline.

## Deployment workflow

Production branch is `main`. The Vercel project `ikigai-royal-map` is Git-connected (framework: Next.js, no env vars required):

```bash
git add .
git commit -m "describe the change"
git push origin main   # Vercel auto-builds and deploys main
```

Quality gates run on every push/PR via `.github/workflows/quality.yml` (`npm ci` → secret scan → `lint` → `typecheck` → `build`).

## Security note: never commit GitHub, Vercel, API, database, or private credentials

- All secrets stay out of the repo: `.env`, `.env*.local`, `*.pem`, and `*.pdf` are git-ignored; CI fails the build if a token pattern or blocked file type is tracked.
- The app uses no backend, auth, or API keys — nothing secret belongs in client-side code or public assets.
- A token removed from a file may still be valid: revoke/rotate it immediately from the provider dashboard (GitHub Settings → Developer settings → Tokens; Vercel Account → Tokens) and review where it was used.

## Future ideas

Accounts-free sync via file import/export, more languages, streak-free gentle reminders (opt-in), printable plan PDF via CSS, PWA offline.

## Confirmations

- Copyrighted PDF **not** uploaded or reproduced; all content original. Footer disclaimer + `/responsible-use` included.
- No API key needed; works fully without authentication.
