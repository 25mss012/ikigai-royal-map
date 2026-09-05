import type { Page } from "@playwright/test";

/** Start every test from isolated browser storage. */
export async function reset(page: Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

const PREFIXES: Array<[string, number]> = [
  ["love", 8],
  ["str", 8],
  ["con", 8],
  ["val", 8],
  ["flo", 8],
];

/** Seed a complete 40-answer assessment directly in storage. */
export async function seedFullAnswers(page: Page, value = 4) {
  await page.goto("/");
  await page.evaluate((v) => {
    const dims: Array<[string, number]> = [["love", 8], ["str", 8], ["con", 8], ["val", 8], ["flo", 8]];
    const answers: Record<string, number> = {};
    for (const [prefix, count] of dims) {
      for (let i = 1; i <= count; i++) answers[`${prefix}${i}`] = v;
    }
    window.localStorage.setItem("ikigai.v1.assessment-answers", JSON.stringify(answers));
  }, value);
}

/** Fill the journal reflection box (placeholder-scoped: avoids the search field). */
export async function fillReflection(page: Page, text: string) {
  const box = page.getByPlaceholder("What mattered today?");
  await box.scrollIntoViewIfNeeded();
  await box.fill(text);
}
