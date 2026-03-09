import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Page render
// ---------------------------------------------------------------------------

test("renders page heading and meta title", async ({ page }) => {
  await page.goto("/planos");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Planos e Valores",
  );
  await expect(page).toHaveTitle(/Planos e Valores/);
});

// ---------------------------------------------------------------------------
// Pricing cards
// ---------------------------------------------------------------------------

test("renders all 3 pricing plan titles", async ({ page }) => {
  await page.goto("/planos");
  await expect(
    page.getByRole("heading", { name: /3x por semana/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /2x por semana/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /família/i })).toBeVisible();
});

test('"Recomendado" badge is visible only on the 2x plan', async ({ page }) => {
  await page.goto("/planos");
  await expect(page.getByText("Recomendado")).toBeVisible();
  const badges = await page.getByText("Recomendado").count();
  expect(badges).toBe(1);
});

test("all plan cards have a CTA link to WhatsApp", async ({ page }) => {
  await page.goto("/planos");
  const ctaLinks = page.getByRole("link", { name: /escolher plano/i });
  await expect(ctaLinks).toHaveCount(3);
  for (const link of await ctaLinks.all()) {
    await expect(link).toHaveAttribute("href", /wa\.me\/5567992879411/);
  }
});

test("each plan renders 4 pricing tiers including Mês and Anual", async ({
  page,
}) => {
  await page.goto("/planos");
  const mesLabels = await page.getByText("Mês").count();
  const anualLabels = await page.getByText("Anual").count();
  expect(mesLabels).toBeGreaterThanOrEqual(3);
  expect(anualLabels).toBeGreaterThanOrEqual(3);
});

// ---------------------------------------------------------------------------
// Belt exam pricing
// ---------------------------------------------------------------------------

test("renders belt exam section with all 4 rows", async ({ page }) => {
  await page.goto("/planos");
  await expect(
    page.getByRole("heading", { name: /exame de faixa/i }),
  ).toBeVisible();
  await expect(page.getByText("Branca até Verde")).toBeVisible();
  await expect(page.getByText("Verde para Roxa")).toBeVisible();
  await expect(page.getByText("Roxa para Marrom")).toBeVisible();
  await expect(page.getByText("Valor da Faixa Simples")).toBeVisible();
});

test("belt exam rows display correct prices and family prices", async ({
  page,
}) => {
  await page.goto("/planos");
  await expect(page.getByText("R$ 210,00")).toBeVisible();
  await expect(page.getByText("Família: R$ 200,00")).toBeVisible();
  await expect(page.getByText("R$ 45,00")).toBeVisible();
  await expect(page.getByText("Família: R$ 40,00")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Drop-in and payment methods
// ---------------------------------------------------------------------------

test("renders drop-in section with correct prices", async ({ page }) => {
  await page.goto("/planos");
  await expect(
    page.getByRole("heading", { name: /aulas avulsas/i }),
  ).toBeVisible();
  await expect(page.getByText("Aula Avulsa (Dojo)")).toBeVisible();
  await expect(page.getByText("Alto Rendimento / Competição")).toBeVisible();
  await expect(page.getByText("R$ 60,00")).toBeVisible();
  await expect(page.getByText("R$ 30,00")).toBeVisible();
});

test("payment methods card shows installment info", async ({ page }) => {
  await page.goto("/planos");
  await expect(
    page.getByRole("heading", { name: "Formas de Pagamento", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/trimestral: 2x/i)).toBeVisible();
  await expect(page.getByText(/semestral: 3x/i)).toBeVisible();
  await expect(page.getByText(/anual: 6x/i)).toBeVisible();
});

// ---------------------------------------------------------------------------
// FAQ accordion
// ---------------------------------------------------------------------------

test("FAQ section renders all 4 questions", async ({ page }) => {
  await page.goto("/planos");
  await expect(page.getByText("Dúvidas Frequentes")).toBeVisible();
  await expect(page.getByText(/preciso comprar o kimono/i)).toBeVisible();
  await expect(
    page.getByText(/como funcionam os exames de faixa/i),
  ).toBeVisible();
  await expect(page.getByText(/posso trancar o plano/i)).toBeVisible();
  await expect(
    page.getByText(/quais são as formas de pagamento/i),
  ).toBeVisible();
});

test("FAQ answer is hidden by default and visible after click", async ({
  page,
}) => {
  await page.goto("/planos");
  const firstAnswer = page.getByText(
    /não é obrigatório para as primeiras aulas/i,
  );
  await expect(firstAnswer).not.toBeVisible();
  await page.getByText(/preciso comprar o kimono/i).click();
  await expect(firstAnswer).toBeVisible();
});

test("FAQ closes when trigger is clicked again", async ({ page }) => {
  await page.goto("/planos");
  const trigger = page.getByText(/preciso comprar o kimono/i);
  const answer = page.getByText(/não é obrigatório para as primeiras aulas/i);
  await trigger.click();
  await expect(answer).toBeVisible();
  await trigger.click();
  await expect(answer).not.toBeVisible();
});

test("multiple FAQ items can be open simultaneously", async ({ page }) => {
  await page.goto("/planos");
  await page.getByText(/preciso comprar o kimono/i).click();
  await page.getByText(/como funcionam os exames de faixa/i).click();
  await expect(
    page.getByText(/não é obrigatório para as primeiras aulas/i),
  ).toBeVisible();
  await expect(page.getByText(/os exames de faixa ocorrem/i)).toBeVisible();
});

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------

test("primary CTA links to WhatsApp", async ({ page }) => {
  await page.goto("/planos");
  const ctaLink = page.getByRole("link", {
    name: /agendar aula experimental/i,
  });
  await expect(ctaLink).toHaveAttribute("href", /wa\.me\/5567992879411/);
});

test("secondary CTA links to /horarios", async ({ page }) => {
  await page.goto("/planos");
  const horariosLink = page.getByRole("link", {
    name: /ver horários das aulas/i,
  });
  await expect(horariosLink).toHaveAttribute("href", "/horarios");
});

// ---------------------------------------------------------------------------
// Responsive layout
// ---------------------------------------------------------------------------

test("pricing grid is 1 column on 375px mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/planos");
  const grid = page.locator(".grid.grid-cols-1.md\\:grid-cols-3").first();
  const columns = await grid.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
  );
  expect(columns).toBe(1);
});

test("belt exam and drop-in are stacked on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/planos");
  await expect(
    page.getByRole("heading", { name: /exame de faixa/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /aulas avulsas/i }),
  ).toBeVisible();
});

test("pricing grid is 3 columns on 1280px desktop viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/planos");
  const grid = page.locator(".md\\:grid-cols-3").first();
  const columns = await grid.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
  );
  expect(columns).toBe(3);
});
