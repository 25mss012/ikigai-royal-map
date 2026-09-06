// One-off launch-asset capture. NOT part of CI.
// Usage: 1) npm run build; 2) start prod server on :3104; 3) node scripts/capture.mjs
// Produces real docs/screenshots/*.png from the running app — never invent images.
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.CAPTURE_BASE ?? "http://localhost:3104";
const OUT = path.join(process.cwd(), "docs", "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const answers = {};
for (const [prefix, count] of [["love", 8], ["str", 8], ["con", 8], ["val", 8], ["flo", 8]]) {
  for (let i = 1; i <= count; i++) answers[`${prefix}${i}`] = 4;
}
const journal = [
  {
    id: "shot1", date: "2026-09-06", mood: 4, energy: 4, purpose: 4,
    text: "A quiet morning walk reminded me that small routines carry the day.",
    tags: ["calm", "morning"], activity: "walking", gratitude: "cool air",
    challenge: "waking up on time", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(`${BASE}/`);
await page.evaluate(() => window.localStorage.clear());
const seedAll = () => page.evaluate(
  ({ a, j }) => {
    window.localStorage.setItem("ikigai.v1.assessment-answers", JSON.stringify(a));
    window.localStorage.setItem("ikigai.v1.journal-entries", JSON.stringify(j));
  },
  { a: answers, j: journal }
);

// 1. hero
await page.goto(`${BASE}/`);
await page.getByRole("heading", { name: /not a destination/ }).waitFor();
await page.screenshot({ path: path.join(OUT, "hero.png") });
// 2. home (full page)
await page.screenshot({ path: path.join(OUT, "home.png"), fullPage: true });
// 3. assessment (fresh storage, so the intro shows, then answer Q1)
await page.goto(`${BASE}/assessment`);
await page.getByTestId("assessment-start").click();
await page.getByRole("radio", { name: /Mostly true/ }).click();
await page.screenshot({ path: path.join(OUT, "assessment.png") });
// 4. results (seed full answers, then submit from review)
await page.goto(`${BASE}/`);
await seedAll();
await page.goto(`${BASE}/assessment`);
await page.getByTestId("assessment-submit").evaluate((b) => b.click());
await page.getByRole("heading", { name: /Three small experiments/ }).waitFor();
await page.screenshot({ path: path.join(OUT, "results.png"), fullPage: true });
// 5. tamil (hero in Tamil)
await page.evaluate(() => {
  window.localStorage.setItem("ikigai.v1.prefs", JSON.stringify({ lang: "ta", theme: "light", contrast: false, textSize: "normal", reducedMotion: true }));
});
await page.goto(`${BASE}/`);
await page.getByRole("heading", { name: /திசை/ }).waitFor();
await page.screenshot({ path: path.join(OUT, "tamil.png") });
// 6. journal (seeded entry, English prefs)
await seedAll();
await page.evaluate(() => {
  window.localStorage.setItem("ikigai.v1.prefs", JSON.stringify({ lang: "en", theme: "light", contrast: false, textSize: "normal", reducedMotion: true }));
});
await page.goto(`${BASE}/journal`);
await page.getByText("A quiet morning walk").waitFor();
await page.screenshot({ path: path.join(OUT, "journal.png") });
// 7. print (results under print media = print stylesheet)
await page.goto(`${BASE}/`);
await seedAll();
await page.goto(`${BASE}/assessment`);
await page.getByTestId("assessment-submit").evaluate((b) => b.click());
await page.getByRole("heading", { name: /Three small experiments/ }).waitFor();
await page.emulateMedia({ media: "print" });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, "print.png"), fullPage: true });

await browser.close();
console.log("captured:", fs.readdirSync(OUT).join(", "));
