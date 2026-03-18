import { test, expect, type Page } from "@playwright/test";

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin@dojo.test";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "testpassword";

// ─── Middleware: Unauthenticated Access ───────────────────────────────────────

test.describe("Admin middleware — unauthenticated access", () => {
  test("visiting /admin redirects to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("visiting /admin/dashboard redirects to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("visiting /admin/students redirects to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin/students");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("redirectTo param is preserved", async ({ page }) => {
    await page.goto("/admin/students");
    await expect(page).toHaveURL(/redirectTo=%2Fadmin%2Fstudents/);
  });
});

// ─── Login Page: Render ───────────────────────────────────────────────────────

test.describe("Login page — /admin/login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
  });

  test("renders page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Login.*Admin/i);
  });

  test("renders 'Área Restrita' heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Área Restrita", exact: true }),
    ).toBeVisible();
  });

  test("renders email and password inputs", async ({ page }) => {
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
  });

  test("renders submit button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /entrar/i })).toBeVisible();
  });

  test("public navbar is NOT rendered", async ({ page }) => {
    await expect(page.getByRole("link", { name: /senseis/i })).not.toBeVisible();
  });

  test("public footer is NOT rendered", async ({ page }) => {
    await expect(page.locator("footer")).not.toBeAttached();
  });
});

// ─── Login Page: Validation ───────────────────────────────────────────────────

test.describe("Login page — form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
  });

  test("shows error for invalid email format", async ({ page }) => {
    await page.getByLabel("E-mail").fill("nao-e-email");
    await page.getByLabel("Senha").fill("senha123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByRole("alert").filter({ hasText: /inválido/i })).toBeVisible();
  });

  test("shows error for wrong credentials", async ({ page }) => {
    await page.getByLabel("E-mail").fill("wrong@test.com");
    await page.getByLabel("Senha").fill("wrongpassword");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByRole("alert").filter({ hasText: /inválid/i })).toContainText(/inválid/i);
  });
});

// ─── Login Flow: Successful Authentication ────────────────────────────────────

test.describe("Login flow — successful authentication", () => {
  test("valid credentials redirect to /admin/dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10_000 });
  });

  test("dashboard renders sidebar nav items", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.waitForURL(/\/admin\/dashboard/);

    const sidebar = page.getByRole("complementary", {
      name: "Admin navigation",
    });
    await expect(
      sidebar.getByRole("link", { name: /dashboard/i }),
    ).toBeVisible();
    await expect(
      sidebar.getByRole("link", { name: /conteúdo/i }),
    ).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /alunos/i })).toBeVisible();
    await expect(
      sidebar.getByRole("link", { name: /financeiro/i }),
    ).toBeVisible();
  });

  test("dashboard renders 'Dashboard' heading", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.waitForURL(/\/admin\/dashboard/);
    await expect(
      page.getByRole("heading", { name: "Dashboard", exact: true }),
    ).toBeVisible();
  });

  test("already logged in: visiting /admin/login redirects to dashboard", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.waitForURL(/\/admin\/dashboard/);

    await page.goto("/admin/login");
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });
});

// ─── Logout Flow ──────────────────────────────────────────────────────────────

test.describe("Logout flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.waitForURL(/\/admin\/dashboard/);
  });

  test("clicking 'Sair' redirects to /admin/login", async ({ page }) => {
    await page.getByRole("button", { name: /sair/i }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("after logout, /admin/dashboard is protected again", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /sair/i }).click();
    await page.waitForURL(/\/admin\/login/);
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

// ─── Responsive Layout ────────────────────────────────────────────────────────

test.describe("Admin shell — responsive layout", () => {
  async function loginAndNavigate(page: Page) {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.waitForURL(/\/admin\/dashboard/);
  }

  test("sidebar is hidden on mobile viewport (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAndNavigate(page);

    const sidebar = page.getByRole("complementary", {
      name: "Admin navigation",
    });
    await expect(sidebar).not.toBeVisible();
  });

  test("sidebar is visible on desktop viewport (1280px)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await loginAndNavigate(page);

    const sidebar = page.getByRole("complementary", {
      name: "Admin navigation",
    });
    await expect(sidebar).toBeVisible();
  });
});
