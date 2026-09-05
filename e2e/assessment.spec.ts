import { test, expect } from "@playwright/test";
import { reset, seedFullAnswers } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
});

test("start, answer, next, back keeps the answer", async ({ page }) => {
  await page.goto("/assessment");
  await page.getByTestId("assessment-start").click();
  await expect(page.getByText("Question 1 of 40")).toBeVisible();
  await page.getByRole("radio", { name: /Mostly true/ }).click();
  await page.getByTestId("assessment-next").click();
  await expect(page.getByText("Question 2 of 40")).toBeVisible();
  await page.getByTestId("assessment-previous").click();
  await expect(page.getByRole("radio", { name: /Mostly true/ })).toBeChecked();
});

test("refresh restores partial progress", async ({ page }) => {
  await page.goto("/assessment");
  await page.getByTestId("assessment-start").click();
  await page.getByRole("radio", { name: /Mostly true/ }).click();
  await page.getByTestId("assessment-next").click();
  await page.reload();
  await expect(page.getByText("Question 2 of 40")).toBeVisible();
  await expect(page.getByText("(1/40)").first()).toBeVisible();
});

test("incomplete submit shows provisional language", async ({ page }) => {
  await page.goto("/assessment");
  await page.getByTestId("assessment-start").click();
  await page.getByRole("radio", { name: /Sometimes true/ }).click();
  await page.getByRole("button", { name: /Jump to review/ }).click();
  await expect(page.getByRole("heading", { name: /Review before submitting/ })).toBeVisible();
  await page.getByTestId("assessment-submit").click();
  await expect(page).toHaveURL(/\/assessment\/results/);
  await expect(page.getByText(/provisional/i).first()).toBeVisible();
});

test("completing all questions shows scores, wheel, and tools", async ({ page }) => {
  await seedFullAnswers(page, 4);
  await page.goto("/assessment");
  await expect(page.getByRole("heading", { name: /Review before submitting/ })).toBeVisible();
  await page.getByTestId("assessment-submit").click();
  await expect(page).toHaveURL(/\/assessment\/results/);
  await expect(page.getByText("Love & Energy").first()).toBeVisible();
  await expect(page.getByText("75%").first()).toBeVisible();
  await expect(page.getByTestId("results-wheel")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Three small experiments/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Reflection prompts/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Export JSON/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Print$/ })).toBeVisible();
});

test("reset clears the result with confirmation", async ({ page }) => {
  await seedFullAnswers(page, 4);
  await page.goto("/assessment");
  await page.getByTestId("assessment-submit").click();
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: /Reset/ }).click();
  await expect(page.getByText("No result yet")).toBeVisible();
});
