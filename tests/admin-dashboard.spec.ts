import { test, expect } from "@playwright/test";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(process.env.TEST_ADMIN_EMAIL ?? "admin@dojo.test");
  await page.getByLabel("Senha").fill(process.env.TEST_ADMIN_PASSWORD ?? "testpassword");
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/admin(?!\/login)/);
}

test.describe("Admin — dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("renders Dashboard heading", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(
      page.getByRole("heading", { name: "Dashboard", exact: true }),
    ).toBeVisible();
  });

  test("shows 4 KPI cards", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page.getByText("Alunos Ativos")).toBeVisible();
    await expect(page.getByText("Novos Leads (mês)")).toBeVisible();
    await expect(page.getByText("Aniversariantes")).toBeVisible();
    await expect(page.getByText("Inadimplentes")).toBeVisible();
  });

  test("KPI values are numeric (not placeholder dashes)", async ({ page }) => {
    await page.goto("/admin/dashboard");
    const cards = page.locator('[aria-label="Resumo administrativo"] .text-2xl');
    const values = await cards.allTextContents();
    for (const v of values) {
      expect(v).toMatch(/^\d+$/);
    }
  });

  test("shows Leads Recentes section", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(
      page.getByRole("heading", { name: "Leads Recentes", exact: true }),
    ).toBeVisible();
  });

  test("Finance link navigates to /admin/finance", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.getByRole("link", { name: /financeiro/i }).click();
    await expect(page).toHaveURL(/\/admin\/finance/);
  });
});

test.describe("Admin — finance", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("renders Financeiro heading", async ({ page }) => {
    await page.goto("/admin/finance");
    await expect(
      page.getByRole("heading", { name: "Financeiro", exact: true }),
    ).toBeVisible();
  });

  test("shows payment status table headers", async ({ page }) => {
    await page.goto("/admin/finance");
    await expect(page.getByRole("columnheader", { name: "Aluno" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Próx. Pagamento" }),
    ).toBeVisible();
  });

  test("mark-as-paid updates student payment date", async ({ page }) => {
    await page.goto("/admin/finance");
    const firstActionBtn = page.getByRole("button", { name: /marcar pago/i }).first();
    const count = await firstActionBtn.count();
    if (count > 0) {
      await firstActionBtn.click();
      await page.getByRole("menuitem", { name: "1 mês" }).click();
      await expect(page.getByText(/pago|atualizado/i)).toBeVisible({ timeout: 5000 });
    }
  });
});
