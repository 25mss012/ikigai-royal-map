import { test, expect } from "@playwright/test";
import { reset } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
  await page.goto("/plan");
});

test("generate, complete, skip, and reschedule", async ({ page }) => {
  await page.getByRole("button", { name: /Generate my plan/ }).click();
  await expect(page.getByText("Write down three activities")).toBeVisible();

  await page.getByTestId("plan-complete-1").click();
  await expect(page.getByTestId("plan-complete-1")).toHaveAttribute("aria-pressed", "true");
  await page.getByTestId("plan-skip-2").click();
  await expect(page.getByTestId("plan-skip-2")).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /Move to tomorrow/ }).first().click();
  await expect(page.getByRole("heading", { name: /Day \d+ of 30/ })).toBeVisible();
  await expect(page.locator("li.royal-card").first()).toBeVisible();
});

test("progress persists across refresh and Day 30 synthesizes", async ({ page }) => {
  await page.getByRole("button", { name: /Generate my plan/ }).click();
  await page.getByTestId("plan-complete-1").click();
  await page.reload();
  await expect(page.getByTestId("plan-complete-1")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Final synthesis")).toBeVisible();
});
