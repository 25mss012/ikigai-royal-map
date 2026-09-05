import { test, expect } from "@playwright/test";
import { reset, fillReflection } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
  await page.goto("/dashboard");
});

test("empty dashboard is welcoming", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Small steps count/ })).toBeVisible();
  await expect(page.getByText("Your journey begins with one small reflection.")).toBeVisible();
});

test("populated dashboard shows recent life", async ({ page }) => {
  await page.goto("/journal");
  await fillReflection(page, "Test reflection");
  await page.getByTestId("journal-save").click();
  await page.goto("/dashboard");
  await expect(page.getByText(/Test reflection/)).toBeVisible();
});

test("export-all downloads the versioned envelope", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("export-all").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.json$/);
  const path = await download.path();
  expect(path).toBeTruthy();
});

test("delete-all asks, wipes, and restores empty states", async ({ page }) => {
  await page.goto("/journal");
  await fillReflection(page, "Test reflection");
  await page.getByTestId("journal-save").click();
  await page.goto("/dashboard");
  page.on("dialog", (d) => d.accept());
  await page.getByTestId("delete-all").click();
  await expect(page.getByText("Your journey begins with one small reflection.")).toBeVisible();
});
