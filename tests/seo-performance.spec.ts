import { test, expect } from "@playwright/test";

test.describe("SEO — meta tags", () => {
  const pages = [
    { path: "/", titleFragment: "Dojo Luciano dos Santos" },
    { path: "/senseis", titleFragment: "Senseis" },
    { path: "/horarios", titleFragment: "Horários" },
    { path: "/galeria", titleFragment: "Galeria" },
    { path: "/campeonatos", titleFragment: "Campeonatos" },
    { path: "/planos", titleFragment: "Planos" },
  ];

  for (const { path, titleFragment } of pages) {
    test(`${path} — title contains "${titleFragment}"`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(new RegExp(titleFragment, "i"));
    });

    test(`${path} — has OG title meta`, async ({ page }) => {
      await page.goto(path);
      const og = page.locator('meta[property="og:title"]');
      await expect(og).toHaveAttribute("content", /.+/);
    });

    test(`${path} — has Twitter card meta`, async ({ page }) => {
      await page.goto(path);
      const twitter = page.locator('meta[name="twitter:card"]');
      await expect(twitter).toHaveAttribute("content", "summary_large_image");
    });

    test(`${path} — has canonical link`, async ({ page }) => {
      await page.goto(path);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute("href", /.+/);
    });
  }
});

test.describe("SEO — sitemap & robots", () => {
  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain("<urlset");
  });

  test("sitemap.xml lists all 6 public routes", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const body = await page.content();
    for (const path of [
      "/senseis",
      "/horarios",
      "/galeria",
      "/campeonatos",
      "/planos",
    ]) {
      expect(body).toContain(path);
    }
  });

  test("robots.txt disallows /admin/", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain("Disallow: /admin/");
  });
});

test.describe("SEO — JSON-LD structured data", () => {
  test("home page has LocalBusiness / SportsActivityLocation schema", async ({
    page,
  }) => {
    await page.goto("/");
    const ld = page.locator('script[type="application/ld+json"]');
    await expect(ld).toHaveCount(1);
    const content = await ld.first().textContent();
    expect(content).toBeTruthy();
    const json = JSON.parse(content!);
    expect(json["@type"]).toMatch(/SportsActivityLocation|LocalBusiness/);
  });

  test("campeonatos page has SportsEvent / ItemList schema", async ({
    page,
  }) => {
    await page.goto("/campeonatos");
    const ld = page.locator('script[type="application/ld+json"]');
    await expect(ld).toHaveCount(2);
  });
});

test.describe("WhatsApp FAB", () => {
  test("FAB is visible on home page", async ({ page }) => {
    await page.goto("/");
    const fab = page.getByRole("link", { name: /whatsapp/i });
    await expect(fab).toBeVisible();
  });

  test("FAB href points to wa.me URL", async ({ page }) => {
    await page.goto("/");
    const fab = page.getByRole("link", { name: /whatsapp/i });
    await expect(fab).toHaveAttribute("href", /wa\.me/);
  });

  test("FAB is visible on /planos", async ({ page }) => {
    await page.goto("/planos");
    const fab = page.getByRole("link", { name: /whatsapp/i });
    await expect(fab).toBeVisible();
  });
});

test.describe("Conversion path — anonymous user", () => {
  test("visits Home → navigates to Horários → WhatsApp CTA resolves", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.getByRole("link", { name: /horários/i }).first().click();
    await expect(page).toHaveURL(/\/horarios/);
    await expect(
      page.getByRole("heading", { name: /horários de treino/i }),
    ).toBeVisible();

    const fab = page.getByRole("link", { name: /whatsapp/i });
    await expect(fab).toBeVisible();
    await expect(fab).toHaveAttribute("href", /wa\.me\/5567992879411/);
  });
});

test.describe("Error pages", () => {
  test("404 page renders for unknown route", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-xyz");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("link", { name: /início/i })).toBeVisible();
  });
});
