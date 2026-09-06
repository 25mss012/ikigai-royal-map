// One-off social-preview render. NOT part of CI.
// Usage: node scripts/og-shot.mjs  (no server needed; renders scripts/og-card.html)
// Writes public/social-preview.png (1280x640, must stay under 1 MB).
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const src = "file://" + path.join(process.cwd(), "scripts", "og-card.html").replace(/\\/g, "/");
const out = path.join(process.cwd(), "public", "social-preview.png");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
await page.goto(src);
await page.waitForTimeout(600);
await page.screenshot({ path: out });
await browser.close();
const bytes = fs.statSync(out).size;
console.log("social-preview.png bytes:", bytes);
if (bytes > 1024 * 1024) {
  console.error("OVER 1 MB — shrink before committing.");
  process.exit(1);
}
