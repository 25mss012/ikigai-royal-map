import { test, expect, type Page } from "@playwright/test";
import { reset, seedFullAnswers, fillReflection, setLang } from "./helpers";
import path from "node:path";

test.describe("tamil journey", () => {
  test.beforeEach(async ({ page }) => {
    await reset(page);
    await setLang(page, "ta");
  });

  test("tamil essay renders tamil body and insight", async ({ page }) => {
    await page.goto("/learn/what-is-ikigai");
    await expect(page.getByRole("heading", { name: "இகிகை என்றால் என்ன?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "முக்கிய நுண்ணறிவு" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "இன்று இதை முயலுங்கள்" })).toBeVisible();
  });

  test("tamil learn index lists tamil titles", async ({ page }) => {
    await page.goto("/learn");
    await expect(page.getByRole("heading", { name: "இருபது சிறு கட்டுரைகள்" })).toBeVisible();
  });

  test("tamil assessment completes with tamil result", async ({ page }) => {
    await seedFullAnswers(page, 4);
    await setLang(page, "ta");
    await page.goto("/assessment");
    await page.getByTestId("assessment-submit").click();
    await expect(page).toHaveURL(/\/assessment\/results/);
    await expect(page.getByText("நடைமுறை ஆராய்வாளர்").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "மூன்று சிறு சோதனைகள்" })).toBeVisible();
  });

  test("tamil validation message on empty flow entry", async ({ page }) => {
    await page.goto("/flow");
    await page.getByTestId("flow-add-entry").click();
    await expect(page.locator('p[role="alert"]')).toContainText(/சிறு பெயர்/);
  });

  test("import and export speak tamil", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("import-choose")).toContainText(/இறக்குமதி/);
    const filePath = path.join(process.cwd(), "e2e", "fixtures", "valid-export.json");
    await page.getByTestId("import-file").setInputFiles(filePath);
    await expect(page.getByTestId("import-preview")).toBeVisible();
    await page.getByTestId("import-confirm").click();
    await expect(page.getByText("இறக்குமதி நிறைவு.")).toBeVisible();
  });
});

test.describe("mobile 320px", () => {
  test.use({ viewport: { width: 320, height: 700 } });

  test.beforeEach(async ({ page }) => {
    await reset(page);
  });

  test("no horizontal overflow on key pages", async ({ page }) => {
    for (const url of ["/", "/learn", "/assessment", "/flow", "/journal", "/dashboard", "/privacy"]) {
      await page.goto(url);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, url).toBeLessThanOrEqual(1);
    }
  });

  test("tamil journal fits without overflow", async ({ page }) => {
    await setLang(page, "ta");
    await page.goto("/journal");
    await fillReflection(page, "குறுகிய திரை சோதனை");
    await page.getByTestId("journal-save").click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("print", () => {
  test.beforeEach(async ({ page }) => {
    await reset(page);
  });

  test("print view hides navigation and shows print header", async ({ page }) => {
    await seedFullAnswers(page, 4);
    await page.goto("/assessment");
    await page.getByTestId("assessment-submit").click();
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("header")).toBeHidden();
    await expect(page.locator("footer")).toBeHidden();
    await expect(page.locator(".print-only").first()).toBeVisible();
    await expect(page.locator(".print-only").first()).toContainText("Ikigai — The Royal Map of Purpose");
  });
});

test.describe("import robustness", () => {
  test.beforeEach(async ({ page }) => {
    await reset(page);
    await page.goto("/dashboard");
  });

  test("minimal older-shape export imports with defaults", async ({ page }) => {
    const filePath = path.join(process.cwd(), "e2e", "fixtures", "minimal-export.json");
    await page.getByTestId("import-file").setInputFiles(filePath);
    await expect(page.getByTestId("import-preview")).toBeVisible();
    await page.getByTestId("import-confirm").click();
    await expect(page.getByText("Import complete.")).toBeVisible();
    await page.goto("/journal");
    await expect(page.getByText("Minimal import reflection")).toBeVisible();
  });

  test("oversized file is rejected before parsing", async ({ page }) => {
    await page.getByTestId("import-file").setInputFiles({
      name: "huge.json",
      mimeType: "application/json",
      buffer: Buffer.alloc(6 * 1024 * 1024, "a"),
    });
    await expect(page.locator('p[role="alert"]')).toContainText(/too large/);
  });

  test("import replaces existing data only on confirm", async ({ page }) => {
    await page.goto("/journal");
    await fillReflection(page, "Old keeper note");
    await page.getByTestId("journal-save").click();
    await page.goto("/dashboard");
    const filePath = path.join(process.cwd(), "e2e", "fixtures", "valid-export.json");
    await page.getByTestId("import-file").setInputFiles(filePath);
    await expect(page.getByTestId("import-preview")).toBeVisible();
    await page.getByTestId("import-confirm").click();
    await page.goto("/journal");
    await expect(page.getByText("Imported test reflection")).toBeVisible();
    await expect(page.getByText("Old keeper note")).toBeHidden();
  });
});

test.describe("dialog keyboard contract", () => {
  test.beforeEach(async ({ page }) => {
    await reset(page);
    await page.goto("/dashboard");
  });

  test("import dialog traps focus, escapes, and returns focus", async ({ page }) => {
    const filePath = path.join(process.cwd(), "e2e", "fixtures", "valid-export.json");
    await page.getByTestId("import-file").setInputFiles(filePath);
    const dialog = page.getByTestId("import-preview");
    await expect(dialog).toBeVisible();
    const checkbox = dialog.getByRole("checkbox");
    await expect(checkbox).toBeFocused();
    // Shift+Tab from first control wraps to the last (Cancel)
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByTestId("import-cancel")).toBeFocused();
    // Tab from last control wraps back to the first
    await page.keyboard.press("Tab");
    await expect(checkbox).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("import-choose")).toBeFocused();
  });
});

test.describe("zoom resilience", () => {
  test.use({ viewport: { width: 640, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await reset(page);
  });

  test("largest text at narrow width does not overflow", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.setItem("ikigai.v1.prefs", JSON.stringify({ lang: "ta", theme: "light", contrast: false, textSize: "xl", reducedMotion: true }));
    });
    await page.reload();
    for (const url of ["/", "/dashboard", "/journal"]) {
      await page.goto(url);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, url).toBeLessThanOrEqual(1);
    }
  });
});
test.describe("preference persistence", () => {
  test.beforeEach(async ({ page }) => {
    await reset(page);
  });

  test("language, theme, and motion persist after refresh", async ({ page }) => {
    await page.goto("/accessibility");
    const panel = page.getByTestId("accessibility-settings");
    await panel.getByLabel("Language").selectOption("ta");
    await panel.getByLabel("தோற்றம்").selectOption("dark");
    await panel.getByLabel("அசைவைக் குறை").check();
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
    await expect(panel.getByLabel("தோற்றம்")).toHaveValue("dark");
  });
});
