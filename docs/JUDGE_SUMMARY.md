# Ikigai Royal Map — Judge Summary (1 page)

**Tagline:** Turn self-reflection into a map for meaningful living.
**Live:** https://ikigai-royal-map.vercel.app · **Code:** https://github.com/25mss012/ikigai-royal-map

**Problem.** Advice about “finding your purpose” is almost entirely passive reading. Real people — students, caregivers, retirees, job seekers, in English or Tamil — need something they can *do* in five minutes, without signing up or paying.

**Solution.** An original bilingual web app inspired by the ideas in García & Miralles' *Ikigai* (purpose, flow, community, mindfulness, resilience). Nothing from the book is copied: every essay, question, score, and visual was created fresh, and the app states plainly that it is independent and unofficial.

**How it works.** Discover (20 short essays) → Reflect (40 gentle questions) → Assess (scores + balance) → Understand (personal pattern map + 3 small experiments) → Journal (private reflections) → Plan (30-day steps) → Continue (dashboard). A one-click demo mode shows the whole journey with sample data and restores your data on exit.

**Innovation.** Three things rarely combined: (1) full English–Tamil experience including all essays and questions; (2) privacy as architecture — no accounts, tracking, or servers, with versioned export/import you control; (3) honest scoring — “not sure” answers stay unscored, incomplete results are labeled provisional, skipped days are data, not failure.

**Technology.** Next.js + TypeScript, Tailwind, Zod-validated browser storage with migration and backups, lazy charts, SVG-only art, PWA metadata, security headers, CI on every push.

**User value.** A private, printable, exportable purpose snapshot plus the next small step — usable in 5 minutes on a 320px phone.

**Validation.** 54/54 browser tests, 22/22 unit tests, clean lint/types/build, live deployment verified route by route.

**Limitations.** Single-device storage by design; English SEO metadata; informational content, not professional advice.
