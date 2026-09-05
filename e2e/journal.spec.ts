import { test, expect } from "@playwright/test";
import { reset, fillReflection } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
  await page.goto("/journal");
  page.on("dialog", (d) => d.accept());
});

test("create and edit an entry", async ({ page }) => {
  await fillReflection(page, "Test reflection");
  await page.getByLabel("Tags (comma separated)").fill("calm");
  await page.getByTestId("journal-save").click();
  await expect(page.getByText("Test reflection")).toBeVisible();

  await page.getByRole("button", { name: /^Edit$/ }).click();
  await fillReflection(page, "Test reflection edited");
  await page.getByTestId("journal-save").click();
  await expect(page.getByText("Test reflection edited")).toBeVisible();
});

test("search and tag filter narrow the list", async ({ page }) => {
  await fillReflection(page, "Test reflection");
  await page.getByLabel("Tags (comma separated)").fill("calm");
  await page.getByTestId("journal-save").click();
  await fillReflection(page, "Sample learning note");
  await page.getByTestId("journal-save").click();

  await page.getByPlaceholder(/Search reflections/).fill("Sample");
  await expect(page.getByText("Sample learning note")).toBeVisible();
  await expect(page.getByText("Test reflection")).toBeHidden();
  await page.getByPlaceholder(/Search reflections/).fill("");

  await page.getByLabel("Filter by tag").selectOption("calm");
  await expect(page.getByText("Test reflection")).toBeVisible();
  await expect(page.getByText("Sample learning note")).toBeHidden();
});

test("JSON and Markdown exports download", async ({ page }) => {
  await fillReflection(page, "Test reflection");
  await page.getByTestId("journal-save").click();

  let downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export JSON/ }).click();
  expect((await downloadPromise).suggestedFilename()).toMatch(/\.json$/);

  downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export Markdown/ }).click();
  expect((await downloadPromise).suggestedFilename()).toMatch(/\.md$/);
});

test("delete one entry, then clear all with confirmation", async ({ page }) => {
  await fillReflection(page, "Test reflection");
  await page.getByTestId("journal-save").click();
  await page.getByRole("button", { name: /^Delete$/ }).click();
  await expect(page.getByText("No entries yet")).toBeVisible();

  await fillReflection(page, "Second note");
  await page.getByTestId("journal-save").click();
  await page.getByRole("button", { name: /Clear all/ }).click();
  await expect(page.getByText("No entries yet")).toBeVisible();
  await page.reload();
  await expect(page.getByText("No entries yet")).toBeVisible();
});
