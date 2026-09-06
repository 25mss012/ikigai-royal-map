# Changelog

## 1.6.0 — 2026-09-06 (repository presentation)
- README redesigned: hero with badges + live/source/release links, clickable visual preview, plain-language product story, Mermaid journey + architecture diagrams, grouped features, Tamil table, demo/privacy/engineering sections, verified quality table, docs map, roadmap, credits.
- Social preview: original 1280×640 `public/social-preview.png` (~116 KB, app palette, no book artwork) rendered via `scripts/og-shot.mjs` from `scripts/og-card.html`; wired as `og:image`/Twitter image; `docs/GITHUB_METADATA.md` holds description, topics, and manual upload steps.
- Corrected essay count 21→20 (verified: 20 slugs) everywhere.
- Removed unused scaffold assets (`public/next.svg`, `public/vercel.svg`). No application logic changed.

## 1.5.0 — 2026-09-06 (demo + portfolio readiness)
- Safe demo mode: one-click sample journey (assessment intro + empty dashboard), persistent banner, exit restores real data byte-for-byte; 4 new unit tests proving bundle shape, score consistency, demo labeling, and no-prefs-overwrite.
- Home 7-step journey strip (Discover→Continue) linking existing routes; About “Why this project exists” transformation section + book credit.
- Portfolio docs: `CASE_STUDY.md`, `JUDGE_SUMMARY.md`, `DEMO_SCRIPT.md` (90s), `DEMO_SHOT_LIST.md`; README demo + updated counts.
- Tests: 54/54 E2E (incl. demo round-trip + real-data preservation) + 22/22 unit, all green.

## 1.4.0 — 2026-09-06 (launch presentation)
- README rewritten as a launch page: positioning as an original bilingual experience inspired by García & Miralles' *Ikigai*, Why-Built, Conceptual Foundation, user journey, Tamil/a11y/testing/technical sections, Credits, and real Visual Preview.
- `docs/screenshots/` captured from the running app via `scripts/capture.mjs` (hero, home, assessment, results, Tamil, journal, print).
- Corrected docs facts: 21 essays, 51 E2E tests, full Tamil completion.
- No application functionality changed.

## 1.3.0 — 2026-09-06 (launch refinement)
- Full Tamil localization: homepage, about, all 21 essays, assessment, results (+ archetype glosses), flow, journal, plan, circle, dashboard, privacy, accessibility, responsible-use, import/export, validation, empty states, 404. Language switch never loses data.
- Mobile-first: overflow guards, wrapping, viewport-safe dialogs; E2E width checks (320px suite, Tamil XL-text zoom case).
- Print: dedicated styles + print header (site name, title, date) on results/plan/journal/circle; Playwright print-media test.
- PWA: original SVG icon, manifest + Apple metadata; documented as installable-metadata-only (no SW, no offline claims).
- Trust: dashboard Privacy-status card; recommendation wording audit (no destiny/score-identity language); audience examples on Learn.
- A11y: import dialog focus trap + focus return; automated keyboard-contract test.
- Tests: 51 E2E (Tamil journeys, mobile, print, import robustness, persistence) + 18 unit, all green.

## 1.2.0 — 2026-09-06 (browser testing + data portability)
- Playwright E2E suite (Chromium, 37 tests): navigation + mobile menu + 404, full assessment journey, results safety, flow math, plan lifecycle, journal CRUD/search/export, circle ≤5 guard, dashboard export/delete, preferences persistence, import preview/confirm/reject.
- Safe portability: versioned export envelope (`ikigai-export v1`), Zod-validated import with preview + explicit replace confirmation, prefs-restore opt-in, 5 MB cap, data-only handling.
- Storage versioning (`lib/migrate.ts`, `ikigai.v1.meta`): per-record sanitizers, single-key reset with timestamped backup, 18 `node:test` unit tests.
- Circle entries can now be edited; stable `data-testid` selectors on key controls.
- CI: new `e2e.yml` (Chromium + build + browser suite, reports on failure only); `test:unit` added to `quality.yml`.
- Docs: E2E guide, export format, “Data portability and recovery” section.

## 1.1.0 — 2026-09-06 (production hardening)
- Security: repo + history sweep clean (no tokens/keys/PDFs); secret-scan gate in CI; security headers (`nosniff`, `Referrer-Policy`, `Permissions-Policy`, `SAMEORIGIN`); README credential section.
- Quality: GitHub Actions workflow (Node 20, `npm ci`, secret scan, lint, typecheck, build) on push/PR/dispatch.
- Safety: per-key localStorage shape validation (corrupted keys reset individually, never wipe-all); guarded result/plan/prefs loading.
- Perf: removed unused `framer-motion` dependency; charts stay lazy with text fallbacks.
- A11y/SEO: metadata for 404 page; theme-color viewport; Tamil essay-translation notice on Learn pages.
- PWA: minimal installable manifest (name, colors, icons); no service worker, no offline claims.
- Verified: `lint`, `tsc --noEmit`, `next build`, full route matrix + 404 on production.

## 1.0.0 — 2026-09-06
- Initial release: home, 20 learning essays, 40-question assessment, scoring engine, results with radar + wheel, Flow Lab, 30-day plan, journal, support circle, dashboard.
- Privacy-first localStorage, export/delete, EN/TA i18n, themes + accessibility panel, SEO (sitemap/robots/OG).
- Tested: `lint`, `tsc --noEmit`, `next build`, manual functional + keyboard pass.
