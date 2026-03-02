import { test, expect } from "@playwright/test";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Senseis", href: "/senseis" },
  { label: "Horários", href: "/horarios" },
  { label: "Galeria", href: "/galeria" },
  { label: "Campeonatos", href: "/campeonatos" },
  { label: "Planos", href: "/planos" },
];

test.describe("Navbar — Desktop (1280 px)", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("logo text is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /dojo luciano dos santos/i }).first()
    ).toBeVisible();
  });

  test("logo links to /", async ({ page }) => {
    const logoLink = page
      .getByRole("link", { name: /dojo luciano dos santos/i })
      .first();
    await expect(logoLink).toHaveAttribute("href", "/");
  });

  for (const { label, href } of NAV_LINKS) {
    test(`nav link "${label}" is visible and points to "${href}"`, async ({
      page,
    }) => {
      const nav = page.locator("nav").first();
      const link = nav.getByRole("link", { name: label }).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
    });
  }

  test('CTA "Agende Aula Grátis" link is visible', async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /agende aula grátis/i }).first()
    ).toBeVisible();
  });

  test("hamburger button is not visible on desktop", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /abrir menu/i })
    ).not.toBeVisible();
  });
});

test.describe("Navbar — Mobile (375 px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hamburger button is visible", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /abrir menu/i })
    ).toBeVisible();
  });

  test("clicking hamburger opens the mobile sheet", async ({ page }) => {
    await page.getByRole("button", { name: /abrir menu/i }).click();
    // Sheet should now reveal nav links
    await expect(page.getByRole("link", { name: "Senseis" }).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Horários" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Campeonatos" }).first()
    ).toBeVisible();
  });

  test("mobile sheet contains the CTA link", async ({ page }) => {
    await page.getByRole("button", { name: /abrir menu/i }).click();
    await expect(
      page.getByRole("link", { name: /agende aula grátis/i }).first()
    ).toBeVisible();
  });
});

test.describe("Navbar — Sticky scroll behaviour", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("navbar remains at the top of the viewport after scrolling down", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 600));
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
    const box = await nav.boundingBox();
    // Sticky top-0: y should be at (or just above) 0 in viewport coordinates
    expect(box?.y).toBeLessThanOrEqual(4);
  });
});
