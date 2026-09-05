import { test, expect } from "@playwright/test";
import { reset } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
  await page.goto("/flow");
});

test("empty state invites the first entry", async ({ page }) => {
  await expect(page.getByText("No flow entries yet")).toBeVisible();
});

test("required fields are validated", async ({ page }) => {
  await page.getByTestId("flow-add-entry").click();
  await expect(page.locator('p[role="alert"]')).toContainText(/short name/);
});

test("add shows the calculated flow score and survives refresh", async ({ page }) => {
  await page.getByLabel("Activity name").fill("Test activity");
  await page.getByLabel("Notes").fill("Sample learning note");
  await page.getByTestId("flow-add-entry").click();
  // focus 3 + enjoyment 3 + challengeFit 5 => 3.7
  await expect(page.getByText("3.7/5").first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Most engaging: Test activity/)).toBeVisible();
});

test("delete restores the empty state", async ({ page }) => {
  await page.getByLabel("Activity name").fill("Test activity");
  await page.getByTestId("flow-add-entry").click();
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: /Delete/ }).click();
  await expect(page.getByText("No flow entries yet")).toBeVisible();
});
