# Ikigai Royal Map — Case Study

## 1. Overview

Ikigai Royal Map is an original bilingual (English–Tamil) interactive self-reflection web app: **turn self-reflection into a map for meaningful living.** A visitor reads short essays, answers 40 gentle questions, receives a personal pattern map with small experiments, journals privately, and builds a 30-day plan. No account, no tracking, no backend — all data stays in the visitor's browser. Live at https://ikigai-royal-map.vercel.app.

## 2. The Inspiration

Héctor García and Francesc Miralles' *Ikigai: The Japanese Secret to a Long and Happy Life* explores purpose, flow, community, mindfulness, resilience, moderation, and lifelong learning. This project treats the book as a compass, not a script: **no text, diagrams, or artwork from the book are reproduced.** Everything — essays, questions, scoring, visuals — is written fresh. The app is independent and unofficial, stated in the footer, About, README, and a dedicated Responsible Use page.

## 3. The Problem

Purpose advice is usually passive reading. People across ages, languages, incomes, and life situations need something *doable*: a way to reflect for five minutes, see their own pattern, and take one small step — without signing up, paying, or reading English fluently.

## 4. The Idea

Convert each book concept into an interaction: the four-area diagram becomes four reflection lenses feeding an assessment; flow becomes a measurable lab; community becomes a private five-person circle; daily purpose becomes a 30-day plan of reversible experiments tracked in a local journal.

## 5. From Book Concepts to Software

| Book idea | App interpretation |
|---|---|
| Reason for being | Daily-meaning essay + journal prompts; purpose framed as direction |
| Four-area diagram | Four reflection lenses (prompts, not verdicts); original SVG wheel |
| Flow | Flow Lab: focus × joy × challenge-fit scoring + friction advice |
| Staying active | 30-day Explore/Learn/Create/Serve/Connect/Restore/Reflect plan |
| Community | Private support circle built on reciprocity (no social network) |
| Mindfulness | Attention essays + 3-breath micro-practices (wellbeing info, not therapy) |
| Resilience | Imperfection-positive copy, provisional results, crisis signposting |
| Learning | 20 original essays, each ending in a 5-minute activity |

## 6. User Journey

Landing → 7-step journey strip (Discover → Reflect → Assess → Understand → Journal → Plan → Continue) → assessment → pattern map + experiments → journal → plan → dashboard. A one-click **demo mode** loads labeled sample data (real data snapshotted and restored on exit) so a new visitor sees the full journey in seconds.

## 7. Key Features

40-Q assessment with transparent math and provisional-result honesty; radar + SVG wheel with text fallbacks; Flow Lab; 30-day plan with Day-30 synthesis; private journal (search/filter/JSON+Markdown export, crisis notice); editable support circle; versioned export/import with preview + explicit replace-confirm; storage migration with per-key repair and backups; print styles; PWA install metadata (no offline claims).

## 8. English + Tamil Localization

~100% of user-facing UI in both languages, including all 20 essays, all 40 questions, results, tools, messages, and trust pages. “Ikigai” is never forced into a misleading one-word equivalent. Language switch preserves saved data; `ta-IN` date formatting.

## 9. Accessibility

Skip link, landmarks, focus rings, full keyboard use (dialog focus trap + Escape + focus return), 44px targets, announced errors, chart text alternatives, reduced-motion + high-contrast + 3 text sizes + light/dark, 200%-zoom-safe, verified 320px→desktop.

## 10. Engineering Decisions

- **No backend on purpose**: privacy is architecture — localStorage (`ikigai.v1.*`) + in-memory fallback, Zod validation, shape guards that reset single corrupt keys.
- **Next.js 14 App Router + TypeScript strict**, Tailwind, lazy Recharts, CSS-only motion, SVG-only art, `next/font` → 87.2 kB shared JS.
- **Interpretation, not reproduction**: copyright boundary enforced by design + CI scans.

## 11. Testing

54 Playwright Chromium E2E (incl. demo round-trip, Tamil journeys, mobile overflow, print-media, dialog keyboard contract) + 22 `node:test` unit tests (migration, portability, demo bundle). CI: Quality workflow (secret scan → lint → typecheck → unit → build) + E2E workflow (fresh Chromium, reports on failure). Rule: suite stays 100% green.

## 12. Deployment

`main` branch → Vercel auto-deploy (Git-connected, Next.js auto-detected, zero env vars). Security headers verified live. `v1.4.0` released with notes.

## 13. Challenges and Solutions

- *Same-URL soft navigation broke seeded states* → seed-then-hard-navigate pattern in capture/E2E helpers.
- *CI secret scanner matched its own pattern text* → excluded docs + scanner file; verified no real secrets.
- *Strict-mode locator collisions* (search box vs form field, duplicate activity names) → exact/placeholder-scoped selectors.
- *Tamil layout overflow risk* → break-word hygiene + automated 320px overflow guards.

## 14. Limitations

Single-device storage by design; SEO metadata English-only; Chromium-only E2E; print verified via media emulation; no offline support; informational content, not medical/career/financial advice.

## 15. What I Learned

Constraints (privacy, bilingual, no backend) produced better design than features would have: versioned export/import replaced sync; imperfection-positive copy replaced streaks; text fallbacks replaced chart-only thinking. Docs written for a 60-second stranger test every claim.

## 16. Future Improvements

More languages; scripted PDF-print assertions; additional browsers in CI; opt-in gentle reminders; richer plan templates. Nothing that compromises privacy or simplicity.
