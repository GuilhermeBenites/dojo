import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Page render
// ---------------------------------------------------------------------------

test("renders page heading and meta title", async ({ page }) => {
  await page.goto("/campeonatos");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Nossas Conquistas e Glórias",
  );
  await expect(page).toHaveTitle(/Campeonatos/);
});

// ---------------------------------------------------------------------------
// Medal counters
// ---------------------------------------------------------------------------

test("medal counters display correct values", async ({ page }) => {
  await page.goto("/campeonatos");
  const hero = page.locator("section").first();
  await expect(hero).toContainText("127");
  await expect(hero).toContainText("84");
  await expect(hero).toContainText("56");
  await expect(hero).toContainText("15");
  await expect(hero).toContainText("Ouro");
  await expect(hero).toContainText("Prata");
  await expect(hero).toContainText("Bronze");
  await expect(hero).toContainText("Troféus Gerais");
});

// ---------------------------------------------------------------------------
// Hall of Fame
// ---------------------------------------------------------------------------

test("renders all 4 Hall of Fame athletes with names and achievements", async ({
  page,
}) => {
  await page.goto("/campeonatos");

  const hallSection = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: /hall da fama/i }) });

  await expect(hallSection.getByText("Sensei Luciano")).toBeVisible();
  await expect(hallSection.getByText("Ana Silva")).toBeVisible();
  await expect(hallSection.getByText("Pedro Santos")).toBeVisible();
  await expect(hallSection.getByText("Julia Costa")).toBeVisible();
  await expect(hallSection.getByText("Campeão Mundial 2022")).toBeVisible();
  await expect(hallSection.getByText("Campeã Brasileira 2023")).toBeVisible();
  await expect(hallSection.getByText("Ouro Pan-Americano")).toBeVisible();
  await expect(hallSection.getByText("Tricampeã Estadual")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Timeline — default state (2 events visible)
// ---------------------------------------------------------------------------

test("timeline shows first 2 events by default", async ({ page }) => {
  await page.goto("/campeonatos");
  await expect(
    page.getByRole("heading", { name: /campeonato paulista de karate 2024/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /copa brasil de clubes/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /open internacional/i }),
  ).not.toBeVisible();
});

test("load more button is visible on initial load", async ({ page }) => {
  await page.goto("/campeonatos");
  await expect(
    page.getByRole("button", { name: /carregar mais resultados/i }),
  ).toBeVisible();
});

// ---------------------------------------------------------------------------
// Timeline — load more
// ---------------------------------------------------------------------------

test('"Carregar mais" reveals the third event', async ({ page }) => {
  await page.goto("/campeonatos");
  await page.getByRole("button", { name: /carregar mais resultados/i }).click();
  await expect(
    page.getByRole("heading", { name: /open internacional/i }),
  ).toBeVisible();
});

test('"Carregar mais" button disappears after all events are shown', async ({
  page,
}) => {
  await page.goto("/campeonatos");
  await page.getByRole("button", { name: /carregar mais resultados/i }).click();
  await expect(
    page.getByRole("button", { name: /carregar mais resultados/i }),
  ).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------

test("primary CTA links to WhatsApp", async ({ page }) => {
  await page.goto("/campeonatos");
  const ctaLink = page.getByRole("link", {
    name: /agendar aula experimental/i,
  });
  await expect(ctaLink).toHaveAttribute("href", /wa\.me\/5567992879411/);
});

test("secondary CTA links to /senseis", async ({ page }) => {
  await page.goto("/campeonatos");
  const senseiLink = page.getByRole("link", {
    name: /conheça nossa história/i,
  });
  await expect(senseiLink).toHaveAttribute("href", "/senseis");
});

// ---------------------------------------------------------------------------
// Responsive layout
// ---------------------------------------------------------------------------

test("hero medal grid has 2 columns on 375px mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/campeonatos");
  const medalGrid = page.locator("section").first().locator(".grid").first();
  const columns = await medalGrid.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
  );
  expect(columns).toBe(2);
});

test("Hall of Fame grid has 1 column on 375px mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/campeonatos");
  const hallSection = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: /hall da fama/i }) });
  const athleteGrid = hallSection.locator(".grid").first();
  const columns = await athleteGrid.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
  );
  expect(columns).toBe(1);
});

test("timeline is visible and scrollable on 375px mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/campeonatos");
  await expect(
    page.getByRole("heading", { name: /campeonato paulista de karate 2024/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /carregar mais resultados/i }),
  ).toBeVisible();
});
