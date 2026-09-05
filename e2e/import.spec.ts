import { test, expect } from "@playwright/test";
import { reset, fillReflection } from "./helpers";
import path from "node:path";

test.beforeEach(async ({ page }) => {
  await reset(page);
  await page.goto("/dashboard");
});

test("import previews counts and replaces on confirm", async ({ page }) => {
  const filePath = path.join(process.cwd(), "e2e", "fixtures", "valid-export.json");
  await page.getByTestId("import-file").setInputFiles(filePath);
  await expect(page.getByTestId("import-preview")).toBeVisible();
  await expect(page.getByTestId("import-preview")).toContainText("Journal entries");
  await page.getByTestId("import-confirm").click();
  await expect(page.getByText("Import complete.")).toBeVisible();
  await page.goto("/journal");
  await expect(page.getByText("Imported test reflection")).toBeVisible();
});

test("import cancel keeps current data", async ({ page }) => {
  const filePath = path.join(process.cwd(), "e2e", "fixtures", "valid-export.json");
  await page.getByTestId("import-file").setInputFiles(filePath);
  await expect(page.getByTestId("import-preview")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("import-preview")).toBeHidden();
  await page.goto("/journal");
  await expect(page.getByText("Imported test reflection")).toBeHidden();
});

test("invalid import is rejected with current data intact", async ({ page }) => {
  await page.goto("/journal");
  await fillReflection(page, "Test reflection");
  await page.getByTestId("journal-save").click();
  await page.goto("/dashboard");
  const filePath = path.join(process.cwd(), "e2e", "fixtures", "invalid-export.json");
  await page.getByTestId("import-file").setInputFiles(filePath);
  await expect(page.locator('p[role="alert"]')).toContainText(/not valid JSON|not.*supported|accepted/i);
  await page.goto("/journal");
  await expect(page.getByText("Test reflection")).toBeVisible();
});
