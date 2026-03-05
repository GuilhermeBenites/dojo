import { test, expect } from "@playwright/test";

test.describe("Horarios page (/horarios)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/horarios");
  });

  // --- Page load & metadata ---
  test("page returns HTTP 200", async ({ page }) => {
    const response = await page.goto("/horarios");
    expect(response?.status()).toBe(200);
  });

  test("page title contains Horários or Localização", async ({ page }) => {
    await expect(page).toHaveTitle(/Horários|Localização/i);
  });

  // --- Page header ---
  test("H1 heading is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /onde treinamos|horários de treino/i,
      })
    ).toBeVisible();
  });

  test("badge 'Encontre seu Caminho' is visible", async ({ page }) => {
    await expect(page.getByText(/encontre seu caminho/i)).toBeVisible();
  });

  // --- Location section ---
  test("address text is visible", async ({ page }) => {
    await expect(page.getByText(/Guia Lopes/i)).toBeVisible();
  });

  test("phone number is visible", async ({ page }) => {
    await expect(page.getByText("(67) 99287-9411")).toBeVisible();
  });

  test("Como Chegar link is present and has href", async ({ page }) => {
    const link = page.getByRole("link", { name: /como chegar/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /.+/);
  });

  // --- Schedule section ---
  test("Grade de Horários heading is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /grade de horários/i })
    ).toBeVisible();
  });

  test("Infantil filter tab is visible and active by default", async ({
    page,
  }) => {
    const infantilTab = page.getByRole("button", {
      name: /ver horários infantil|^infantil$/i,
    });
    await expect(infantilTab).toBeVisible();
    await expect(infantilTab).toHaveAttribute("aria-pressed", "true");
  });

  test("Adultos filter tab is visible", async ({ page }) => {
    await expect(
      page.getByRole("button", {
        name: /ver horários adultos|^adultos$/i,
      })
    ).toBeVisible();
  });

  test("at least one schedule day card is visible", async ({ page }) => {
    await expect(page.getByText(/Segunda \/ Quarta \/ Sexta/i)).toBeVisible();
  });

  // --- Category filter interactivity ---
  test("clicking Adultos tab shows Adultos schedule", async ({ page }) => {
    await page.getByRole("button", { name: /ver horários adultos|^adultos$/i }).click();
    await expect(page.getByText("06:30 - 07:30")).toBeVisible();
    await expect(page.getByText("Sensei Wynner Armoa")).toBeVisible();
  });

  test("clicking Infantil tab restores Infantil schedules", async ({ page }) => {
    await page.getByRole("button", { name: /ver horários adultos|^adultos$/i }).click();
    await page.getByRole("button", { name: /ver horários infantil|^infantil$/i }).click();
    await expect(page.getByText("16:00 - 17:00").first()).toBeVisible();
    await expect(page.getByText("Sensei Anna Santos").first()).toBeVisible();
  });

  // --- CTA banner ---
  test("CTA heading is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /pronto para começar sua jornada/i,
      })
    ).toBeVisible();
  });

  test("Agendar Aula Grátis button is visible", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /agendar aula grátis/i })
    ).toBeVisible();
  });

  // --- Responsiveness ---
  test("mobile viewport renders without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/horarios");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375 + 1);
  });

  test("on mobile location card and map stack vertically", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/horarios");
    const mapSection = page.getByLabel(/mapa da localização/i);
    const locationHeading = page.getByRole("heading", {
      name: "Onde Treinamos",
      exact: true,
    });
    const mapBox = await mapSection.boundingBox();
    const headingBox = await locationHeading.boundingBox();
    expect(mapBox).toBeTruthy();
    expect(headingBox).toBeTruthy();
    expect(mapBox!.y).toBeGreaterThan(
      headingBox!.y + headingBox!.height - 10
    );
  });

  // --- Accessibility ---
  test("page has a single main landmark", async ({ page }) => {
    const mainCount = await page.locator("main").count();
    expect(mainCount).toBe(1);
  });

  test("map placeholder has descriptive text", async ({ page }) => {
    const mapEl = page.getByLabel(/mapa da localização/i);
    await expect(mapEl).toBeVisible();
  });

  // --- SSR verification ---
  test("H1 heading is visible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/horarios");
    const heading = page.getByRole("heading", {
      level: 1,
      name: /onde treinamos|horários/i,
    });
    await expect(heading).toBeVisible();
    await context.close();
  });

  test("address text is visible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/horarios");
    await expect(page.getByText(/Guia Lopes/i)).toBeVisible();
    await context.close();
  });
});
