import { test, expect } from "@playwright/test";
import { reset, fillReflection } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
});

test("enter from assessment intro shows the full demo journey", async ({ page }) => {
  await page.goto("/assessment");
  await page.getByTestId("demo-enter").click();
  await expect(page).toHaveURL(/\/assessment\/results/);
  await expect(page.getByTestId("demo-banner")).toContainText(/Demo data/);
  await expect(page.getByText("Love & Energy").first()).toBeVisible();

  await page.goto("/journal");
  await expect(page.getByText(/Demo reflection/).first()).toBeVisible();
  await expect(page.getByTestId("demo-banner")).toBeVisible();

  await page.goto("/flow");
  await expect(page.getByText("Demo: morning sketch").first()).toBeVisible();
});

test("exit restores the empty state", async ({ page }) => {
  await page.goto("/assessment");
  await page.getByTestId("demo-enter").click();
  await expect(page.getByTestId("demo-banner")).toBeVisible();
  await page.getByTestId("demo-exit").click();
  await expect(page.getByTestId("demo-banner")).toBeHidden();
  await page.goto("/journal");
  await expect(page.getByText("No entries yet")).toBeVisible();
  await page.goto("/assessment/results");
  await expect(page.getByText("No result yet")).toBeVisible();
});

test("real user data survives a demo round-trip", async ({ page }) => {
  await page.goto("/journal");
  await fillReflection(page, "Keeper note");
  await page.getByTestId("journal-save").click();
  await expect(page.getByText("Keeper note")).toBeVisible();

  await page.goto("/assessment");
  await page.getByTestId("demo-enter").click();
  await expect(page.getByTestId("demo-banner")).toBeVisible();
  await page.goto("/journal");
  await expect(page.getByText(/Demo reflection/).first()).toBeVisible();
  await expect(page.getByText("Keeper note")).toBeHidden();

  await page.getByTestId("demo-exit").click();
  await page.goto("/journal");
  await expect(page.getByText("Keeper note")).toBeVisible();
  await expect(page.getByText(/Demo reflection/).first()).toBeHidden();
});
