import { test, expect } from "@playwright/test";
import { reset } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
});

test("language toggle switches navigation copy and persists", async ({ page }) => {
  const primary = page.getByRole("navigation", { name: "Primary" });
  await page.getByTestId("language-toggle").click();
  await expect(primary.getByText("கற்க")).toBeVisible();
  await page.reload();
  await expect(primary.getByText("கற்க")).toBeVisible();
  await page.getByTestId("language-toggle").click();
  await expect(primary.getByText("Learn")).toBeVisible();
});

test("theme toggle flips the stored theme", async ({ page }) => {
  await page.getByTestId("theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("accessibility settings apply reduced motion, contrast, and text size", async ({ page }) => {
  await page.goto("/accessibility");
  const panel = page.getByTestId("accessibility-settings");
  await expect(panel).toBeVisible();
  await panel.getByLabel("Reduce motion").check();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await panel.getByLabel("High contrast").check();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
  await panel.getByLabel("Text size").selectOption("large");
  await expect(page.locator("html")).toHaveAttribute("data-textsize", "large");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
});
