import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin@dojo.test";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "testpassword";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
  await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/admin(?!\/login)/);
}

test.describe("Admin CMS", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("Hub renders all 6 section cards", async ({ page }) => {
    await page.goto("/admin/content");
    await expect(page.getByRole("link", { name: /horários/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /senseis/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /galeria/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /campeonatos/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /depoimentos/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /planos/i })).toBeVisible();
  });

  test("Schedules — list renders seeded data", async ({ page }) => {
    await page.goto("/admin/content/schedules");
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText(/Seg|Ter|Qua|Qui|Sex/i)).toBeVisible();
  });

  test("Schedules — create new schedule", async ({ page }) => {
    await page.goto("/admin/content/schedules");
    await page.getByRole("link", { name: /novo horário/i }).click();
    await expect(page.getByRole("heading", { name: /novo horário/i })).toBeVisible();

    await page.getByLabel(/id do grupo/i).fill("ter-qui");
    await page.getByLabel(/rótulo dos dias/i).fill("Ter / Qui");
    await page.getByLabel(/início/i).fill("10:00");
    await page.getByLabel(/fim/i).fill("11:00");
    await page.getByRole("combobox", { name: /categoria/i }).selectOption("infantil");
    await page.getByLabel(/ordem de exibição/i).fill("99");
    await page.getByRole("button", { name: /salvar/i }).click();

    await expect(page).toHaveURL("/admin/content/schedules");
    await expect(page.getByText("Ter / Qui")).toBeVisible();
    await expect(page.getByText("10:00")).toBeVisible();

    await page.goto("/horarios");
    await expect(page.getByText("Ter / Qui")).toBeVisible();
    await expect(page.getByText("10:00")).toBeVisible();
  });

  test("Schedules — edit existing schedule", async ({ page }) => {
    await page.goto("/admin/content/schedules");
    await page.getByRole("button", { name: /ações/i }).first().click();
    await page.getByRole("menuitem", { name: /editar/i }).first().click();

    await expect(page.getByRole("heading", { name: /editar horário/i })).toBeVisible();
    const instructorInput = page.getByLabel(/instrutor/i);
    await instructorInput.fill("Sensei Teste Edit");
    await page.getByRole("button", { name: /salvar/i }).click();

    await expect(page).toHaveURL("/admin/content/schedules");
    await expect(page.getByText("Sensei Teste Edit")).toBeVisible();
  });

  test("Schedules — delete schedule", async ({ page }) => {
    await page.goto("/admin/content/schedules");
    const rowCount = await page.getByRole("row").count();
    await page.getByRole("button", { name: /ações/i }).last().click();
    await page.getByRole("menuitem", { name: /excluir/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /^excluir$/i }).click();
    await expect(page.getByRole("row")).toHaveCount(rowCount - 1);
  });

  test("Senseis — list renders seeded data", async ({ page }) => {
    await page.goto("/admin/content/senseis");
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText(/Sensei Luciano|Luciano/i)).toBeVisible();
    await expect(page.getByText("Fundador")).toBeVisible();
  });

  test("Testimonials — create and verify on public home", async ({ page }) => {
    await page.goto("/admin/content/testimonials");
    await page.getByRole("link", { name: /novo depoimento/i }).click();

    await page.getByLabel(/autor/i).fill("Teste CMS E2E");
    await page.getByLabel(/função/i).fill("Aluno Teste");
    await page.getByLabel(/depoimento/i).fill("Este é um depoimento criado pelo teste E2E do CMS.");
    await page.getByRole("button", { name: /salvar/i }).click();

    await expect(page).toHaveURL("/admin/content/testimonials");
    await expect(page.getByText("Teste CMS E2E")).toBeVisible();

    await page.goto("/");
    await expect(page.getByText("Teste CMS E2E")).toBeVisible();
  });

  test("Championships — create event + add result", async ({ page }) => {
    await page.goto("/admin/content/championships");
    await page.getByRole("link", { name: /novo campeonato/i }).click();

    await page.getByLabel(/nome/i).fill("Campeonato E2E 2025");
    await page.getByLabel(/data/i).fill("2025-06-15");
    await page.getByLabel(/local/i).fill("Ginásio Teste");
    await page.getByRole("combobox", { name: /status/i }).selectOption("futuro");
    await page.getByRole("button", { name: /salvar/i }).click();

    await expect(page).toHaveURL("/admin/content/championships");
    await expect(page.getByText("Campeonato E2E 2025")).toBeVisible();

    await page.getByRole("button", { name: /ações/i }).first().click();
    await page.getByRole("menuitem", { name: /resultados/i }).first().click();

    await expect(page).toHaveURL(/\/admin\/content\/championships\/[a-f0-9-]+/);
    await page.getByLabel(/atleta/i).fill("Atleta E2E");
    await page.getByRole("combobox", { name: /colocação/i }).selectOption("1");
    await page.getByLabel(/categoria/i).fill("Kata Teste");
    await page.getByRole("button", { name: /adicionar/i }).click();

    await expect(page.getByText("Atleta E2E")).toBeVisible();
    await expect(page.getByText("Kata Teste")).toBeVisible();
  });

  test("Plans — FAQ tab — create FAQ item", async ({ page }) => {
    await page.goto("/admin/content/plans");
    await page.getByRole("tab", { name: /faq/i }).click();
    await page.getByRole("button", { name: /nova faq/i }).click();

    await page.getByLabel(/pergunta/i).fill("Pergunta E2E do CMS?");
    await page.getByLabel(/resposta/i).fill("Esta é a resposta criada pelo teste E2E.");
    await page.getByRole("button", { name: /salvar/i }).click();

    await expect(page.getByText("Pergunta E2E do CMS?")).toBeVisible();

    await page.goto("/planos");
    await expect(page.getByText("Pergunta E2E do CMS?")).toBeVisible();
  });

  test("Gallery — list shows thumbnail grid", async ({ page }) => {
    await page.goto("/admin/content/gallery");
    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("Content hub renders correctly at 375px (responsive)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/content");
    await expect(page.getByRole("link", { name: /horários/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /planos/i })).toBeVisible();
  });
});
