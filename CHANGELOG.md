# Changelog

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
