import { test, expect } from "@playwright/test";

const QUICK_LINKS = [
  { label: "Início", href: "/" },
  { label: "Senseis", href: "/senseis" },
  { label: "Horários", href: "/horarios" },
  { label: "Planos", href: "/planos" },
];

test.describe("Footer", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("footer element is present on the page", async ({ page }) => {
    await expect(page.locator("footer")).toBeAttached();
  });

  test('renders "Links Rápidos" section heading', async ({ page }) => {
    const footer = page.locator("footer");
    await expect(
      footer.getByRole("heading", { name: /links rápidos/i })
    ).toBeVisible();
  });

  test('renders "Fale Conosco" section heading', async ({ page }) => {
    const footer = page.locator("footer");
    await expect(
      footer.getByRole("heading", { name: /fale conosco/i })
    ).toBeVisible();
  });

  for (const { label, href } of QUICK_LINKS) {
    test(`quick link "${label}" is visible and points to "${href}"`, async ({
      page,
    }) => {
      const footer = page.locator("footer");
      const link = footer.getByRole("link", { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
    });
  }

  test("Instagram social icon has accessible aria-label", async ({ page }) => {
    const footer = page.locator("footer");
    const instagram = footer.getByRole("link", { name: /instagram/i });
    await expect(instagram).toBeVisible();
    await expect(instagram).toHaveAttribute("aria-label", "Instagram");
  });

  test("WhatsApp social icon has accessible aria-label", async ({ page }) => {
    const footer = page.locator("footer");
    const whatsapp = footer.getByRole("link", { name: /whatsapp/i });
    await expect(whatsapp).toBeVisible();
    await expect(whatsapp).toHaveAttribute("aria-label", "WhatsApp");
  });

  test('"Agende sua aula" CTA link is visible', async ({ page }) => {
    const footer = page.locator("footer");
    await expect(
      footer.getByRole("link", { name: /agende sua aula/i })
    ).toBeVisible();
  });

  test("copyright notice is visible", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(
      footer.getByText(/© 2025 dojo luciano dos santos/i)
    ).toBeVisible();
  });

  test('"Privacidade" legal link is visible', async ({ page }) => {
    const footer = page.locator("footer");
    await expect(
      footer.getByRole("link", { name: /privacidade/i })
    ).toBeVisible();
  });

  test('"Termos" legal link is visible', async ({ page }) => {
    const footer = page.locator("footer");
    await expect(
      footer.getByRole("link", { name: /termos/i })
    ).toBeVisible();
  });
});

test.describe("Footer — Mobile (375 px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("footer is visible and copyright is readable on mobile", async ({
    page,
  }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(
      footer.getByText(/© 2025 dojo luciano dos santos/i)
    ).toBeVisible();
  });
});
