import { test, expect } from "@playwright/test";

test.describe("Senseis page (/senseis)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/senseis");
  });

  // --- Page load & metadata ---
  test("page title contains 'Senseis'", async ({ page }) => {
    await expect(page).toHaveTitle(/Senseis/i);
  });

  test("page returns HTTP 200", async ({ page }) => {
    const response = await page.goto("/senseis");
    expect(response?.status()).toBe(200);
  });

  // --- Founder Hero section ---
  test("renders Founder heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /sensei luciano dos santos/i,
      })
    ).toBeVisible();
  });

  test("renders founder badge 'Mestre & Fundador'", async ({ page }) => {
    await expect(page.getByText(/mestre & fundador/i)).toBeVisible();
  });

  test("renders founder bio text", async ({ page }) => {
    await expect(page.getByText(/25 anos de dedicação/i)).toBeVisible();
  });

  test("renders founder blockquote", async ({ page }) => {
    await expect(page.getByRole("blockquote")).toBeVisible();
    await expect(page.getByText(/verdadeiro oponente/i)).toBeVisible();
  });

  test("renders 'Conheça a História Completa' CTA button", async ({
    page,
  }) => {
    await expect(
      page.getByRole("link", { name: /conheça a história completa/i })
    ).toBeVisible();
  });

  // --- Instructors Grid ---
  test("renders 'Equipe de Instrutores' heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /equipe de instrutores/i })
    ).toBeVisible();
  });

  test("renders 3 instructor cards", async ({ page }) => {
    const articles = page.locator("article");
    await expect(articles).toHaveCount(3);
  });

  test("each instructor card has a 'Ver Perfil' link", async ({ page }) => {
    const cards = page.locator("article");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).getByRole("link", { name: /ver perfil/i })).toBeVisible();
    }
  });

  test("renders specialty badges on instructor cards", async ({ page }) => {
    await expect(page.getByText("Infantil", { exact: true })).toBeVisible();
    await expect(page.getByText("Kata & Técnica", { exact: true })).toBeVisible();
    await expect(page.getByText("Alto Rendimento", { exact: true })).toBeVisible();
  });
  
  // --- Responsiveness ---
  test("mobile viewport renders without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/senseis");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375 + 1); // Allow 1px tolerance
  });

  test("instructor grid stacks to 1 column on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/senseis");
    const section = page
      .locator("section")
      .filter({ hasText: "Equipe de Instrutores" });
    const firstCard = section.locator("article").first();
    const secondCard = section.locator("article").nth(1);
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    expect(firstBox).toBeTruthy();
    expect(secondBox).toBeTruthy();
    expect(secondBox!.y).toBeGreaterThan(
      firstBox!.y + firstBox!.height - 10
    );
  });

  // --- Accessibility ---
  test("page has a single <main> landmark", async ({ page }) => {
    const mainCount = await page.locator("main").count();
    expect(mainCount).toBe(1);
  });

  test("founder image has non-empty alt text", async ({ page }) => {
    const founderSection = page.locator("section").first();
    const founderImg = founderSection.locator("img").first();
    const alt = await founderImg.getAttribute("alt");
    expect(alt).toBeTruthy();
    expect(alt?.length).toBeGreaterThan(0);
  });

  test("instructor images all have non-empty alt text", async ({ page }) => {
    const cards = page.locator("article");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const alt = await cards.nth(i).locator("img").getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  // --- SSR verification ---
  test("founder heading is present in SSR HTML (no JS required)", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/senseis");
    const heading = page.getByRole("heading", {
      name: /sensei luciano dos santos/i,
    });
    await expect(heading).toBeVisible();
    await context.close();
  });
});
