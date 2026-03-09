import { test, expect } from "@playwright/test";

test.describe("Galeria page (/galeria)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/galeria");
  });

  // --- Page load & metadata ---
  test("renders page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toContainText("Nossa Jornada");
    await expect(page).toHaveTitle(/Galeria/);
  });

  test("shows all gallery items by default", async ({ page }) => {
    const items = page.locator(".masonry-item");
    await expect(items).toHaveCount(8);
    const todosBtn = page.getByRole("button", { name: /mostrar todos/i });
    await expect(todosBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("filters to Sensei Luciano category", async ({ page }) => {
    await page
      .getByRole("button", { name: /mostrar sensei luciano/i })
      .click();
    await expect(page.locator(".masonry-item")).toHaveCount(3);
    await expect(
      page.getByRole("button", { name: /mostrar sensei luciano/i })
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("returns all items when Todos is clicked again", async ({ page }) => {
    await page
      .getByRole("button", { name: /mostrar aulas infantis/i })
      .click();
    await page.getByRole("button", { name: /mostrar todos/i }).click();
    await expect(page.locator(".masonry-item")).toHaveCount(8);
  });

  test("opens lightbox on card click", async ({ page }) => {
    await page
      .locator(".masonry-item")
      .first()
      .getByRole("button", { name: /ampliar/i })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Sensei Luciano");
  });

  test("closes lightbox with close button", async ({ page }) => {
    await page
      .locator(".masonry-item")
      .first()
      .getByRole("button", { name: /ampliar/i })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /fechar/i })
      .click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("closes lightbox with Escape key", async ({ page }) => {
    await page
      .locator(".masonry-item")
      .first()
      .getByRole("button", { name: /ampliar/i })
      .click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("navigates to next image in lightbox", async ({ page }) => {
    await page
      .locator(".masonry-item")
      .first()
      .getByRole("button", { name: /ampliar/i })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Sensei Luciano");
    await dialog.getByRole("button", { name: /próxima/i }).click();
    await expect(dialog).toContainText("Kata em Grupo");
  });

  test("masonry grid has 1 column on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/galeria");
    const grid = page.locator(".masonry-grid");
    const columnCount = await grid.evaluate((el) =>
      getComputedStyle(el).getPropertyValue("column-count")
    );
    expect(columnCount).toBe("1");
  });

  test("filter bar remains in viewport when scrolled", async ({ page }) => {
    await page.goto("/galeria");
    await page.evaluate(() => window.scrollTo(0, 800));
    const filterBar = page.locator(
      '[aria-label="Filtrar galeria por categoria"]'
    );
    await expect(filterBar).toBeInViewport();
  });

  test("CTA button has correct WhatsApp href", async ({ page }) => {
    await page.goto("/galeria");
    const ctaLink = page
      .getByRole("link", { name: /agende|whatsapp|agendar aula/i })
      .last();
    await expect(ctaLink).toHaveAttribute("href", /wa\.me\/5567992879411/);
  });
});
