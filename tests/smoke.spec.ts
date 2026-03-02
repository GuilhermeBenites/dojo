import { test, expect } from "@playwright/test";

/**
 * Smoke test — verifies the app shell is healthy before running
 * feature-specific E2E suites.
 */
test.describe("App shell smoke test", () => {
  test("home page loads and returns 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("page title contains the dojo name", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/dojo luciano dos santos/i);
  });

  test("HTML lang attribute is pt-BR", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("pt-BR");
  });

  test("page contains semantic <nav>, <main>, and <footer> elements", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("nav").first()).toBeAttached();
    await expect(page.locator("main")).toBeAttached();
    await expect(page.locator("footer")).toBeAttached();
  });
});
