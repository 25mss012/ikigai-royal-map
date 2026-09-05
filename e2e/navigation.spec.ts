import { test, expect } from "@playwright/test";
import { reset } from "./helpers";

test.beforeEach(async ({ page }) => {
  await reset(page);
});

test("homepage loads with hero and calls to action", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Your purpose is not a destination/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Begin Your Journey/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore Ikigai/ })).toBeVisible();
});

test("main navigation reaches Learn", async ({ page }) => {
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Learn" }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole("heading", { name: /Twenty small essays/ })).toBeVisible();
});

test("learn index opens a detail essay", async ({ page }) => {
  await page.goto("/learn");
  await page.getByRole("link", { name: /What is Ikigai/ }).first().click();
  await expect(page).toHaveURL(/\/learn\/what-is-ikigai/);
  await expect(page.getByText("Try this today")).toBeVisible();
});

test("trust pages open", async ({ page }) => {
  for (const [url, heading] of [
    ["/privacy", /Private by default/],
    ["/accessibility", /Comfortable for everyone/],
    ["/responsible-use", /Responsible use/],
  ] as const) {
    await page.goto(url);
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
  }
});

test("footer carries the independence disclaimer", async ({ page }) => {
  await expect(page.getByText(/independent educational companion/)).toBeVisible();
});

test("invalid route shows the custom 404", async ({ page }) => {
  await page.goto("/nope-not-a-route");
  await expect(page.getByRole("heading", { name: /wandered off the map/ })).toBeVisible();
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, navigates, and closes", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /menu/i });
    await toggle.click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Learn" }).click();
    await expect(page).toHaveURL(/\/learn$/);
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  });
});
