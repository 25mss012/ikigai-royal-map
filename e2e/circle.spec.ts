import { test, expect, type Page } from "@playwright/test";
import { reset } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
  await page.goto("/circle");
  page.on("dialog", (d) => d.accept());
});

async function addEntry(page: Page, label: string) {
  await page.getByLabel("Name or label").fill(label);
  await page.getByTestId("circle-add").click();
  await expect(page.getByText(label, { exact: true })).toBeVisible();
}

test("add, edit, and delete one entry", async ({ page }) => {
  await expect(page.getByText("Your circle is empty")).toBeVisible();
  await addEntry(page, "Test group");

  await page.getByRole("button", { name: /^Edit$/ }).click();
  await page.getByLabel("Name or label").fill("Test group edited");
  await page.getByTestId("circle-add").click();
  await expect(page.getByText("Test group edited", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Remove/ }).click();
  await expect(page.getByText("Your circle is empty")).toBeVisible();
});

test("five entries allowed, sixth rejected gracefully, persistence holds", async ({ page }) => {
  for (let i = 1; i <= 5; i++) await addEntry(page, `Test ${i}`);
  await page.getByLabel("Name or label").fill("Test 6");
  await page.getByTestId("circle-add").click();
  await expect(page.locator('p[role="alert"]')).toContainText(/five steady entries/);
  await expect(page.getByText("Test 6", { exact: true })).toBeHidden();
  await page.reload();
  await expect(page.getByText("Test 5", { exact: true })).toBeVisible();
});
