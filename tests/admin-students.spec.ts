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

/**
 * Serial: shared DB mutations (create / delete / toggle) and ordering for
 * tests that assume rows exist. Unauthenticated redirect is covered in
 * tests/admin-auth.spec.ts.
 */
test.describe("Admin — students", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("renders page heading 'Alunos'", async ({ page }) => {
    await page.goto("/admin/students");
    await expect(
      page.getByRole("heading", { name: "Alunos", exact: true }),
    ).toBeVisible();
  });

  test("shows empty-state when no students match search", async ({
    page,
  }) => {
    await page.goto("/admin/students?search=xyzNonExistentName12345");
    await expect(page.getByText("Nenhum aluno encontrado")).toBeVisible();
  });

  test("opens 'Novo Aluno' sheet via URL param", async ({ page }) => {
    await page.goto("/admin/students?action=new");
    await expect(
      page.getByRole("heading", { name: "Novo Aluno" }),
    ).toBeVisible();
    await expect(page.getByLabel("Nome")).toBeVisible();
  });

  test("creates a student via the form", async ({ page }) => {
    await page.goto("/admin/students?action=new");
    await page.getByLabel("Nome").fill("Aluno Teste E2E");
    await page.getByRole("combobox", { name: "Faixa" }).click();
    await page.getByRole("option", { name: "Branca" }).click();
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText("Aluno Teste E2E")).toBeVisible();
  });

  test("edits a student via row actions", async ({ page }) => {
    await page.goto("/admin/students");
    await page.getByRole("button", { name: "Ações" }).first().click();
    await page.getByRole("menuitem", { name: "Editar" }).click();
    await expect(
      page.getByRole("heading", { name: "Editar Aluno" }),
    ).toBeVisible();
  });

  test("validates required name field", async ({ page }) => {
    await page.goto("/admin/students?action=new");
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText("Nome obrigatório")).toBeVisible();
  });

  test("birthday panel heading is visible", async ({ page }) => {
    await page.goto("/admin/students");
    await expect(page.getByText(/Aniversariantes do mês/)).toBeVisible();
  });

  test("belt filter shows only matching belt badges", async ({ page }) => {
    await page.goto("/admin/students?action=new");
    await page.getByLabel("Nome").fill("Aluno Faixa Preta E2E");
    await page.getByRole("combobox", { name: "Faixa" }).click();
    await page.getByRole("option", { name: "Preta 1º Dan" }).click();
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText("Aluno Faixa Preta E2E")).toBeVisible();

    await page.goto("/admin/students?belt=preta-1");
    const badges = await page.getByTestId("belt-badge").allTextContents();
    expect(badges.length).toBeGreaterThan(0);
    badges.forEach((b) => expect(b).toBe("Preta 1º Dan"));
  });

  test("toggle active status inline", async ({ page }) => {
    await page.goto("/admin/students");
    const firstSwitch = page.getByRole("switch").first();
    const initialState = await firstSwitch.isChecked();
    await firstSwitch.click();
    await expect(firstSwitch).toBeChecked({ checked: !initialState });
  });

  test("deletes a student with confirmation dialog", async ({ page }) => {
    await page.goto("/admin/students?action=new");
    await page.getByLabel("Nome").fill("Aluno Para Deletar");
    await page.getByRole("combobox", { name: "Faixa" }).click();
    await page.getByRole("option", { name: "Branca" }).click();
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText("Aluno Para Deletar")).toBeVisible();

    await page.getByRole("button", { name: "Ações" }).last().click();
    await page.getByRole("menuitem", { name: "Excluir" }).click();
    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /^excluir$/i }).click();
    await expect(page.getByText("Aluno Para Deletar")).not.toBeVisible();
  });
});
