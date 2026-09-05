import { test, expect } from "@playwright/test";
import { reset, seedFullAnswers, fillReflection } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
});

test("empty results explains the next step", async ({ page }) => {
  await page.goto("/assessment/results");
  await expect(page.getByText("No result yet")).toBeVisible();
  await expect(page.getByRole("link", { name: /Start assessment/ })).toBeVisible();
});

test("recommendations and prompts appear after completion", async ({ page }) => {
  await seedFullAnswers(page, 4);
  await page.goto("/assessment");
  await page.getByTestId("assessment-submit").click();
  await expect(page.getByRole("heading", { name: /Three small experiments/ })).toBeVisible();
  await expect(page.getByText(/This is a temporary pattern/).first()).toBeVisible();
});

test("JSON export downloads and share summary hides journal text", async ({ page }) => {
  const secret = "ZebraQuiltSecretReflection";
  await page.goto("/journal");
  await fillReflection(page, secret);
  await page.getByTestId("journal-save").click();
  await expect(page.getByText(secret)).toBeVisible();

  await seedFullAnswers(page, 4);
  await page.goto("/assessment");
  await page.getByTestId("assessment-submit").click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export JSON/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.json$/);

  const summary = page.getByText(/My current reflection/);
  await expect(summary).toBeVisible();
  await expect(summary).not.toContainText(secret);
});
