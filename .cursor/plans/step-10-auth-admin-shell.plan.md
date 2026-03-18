---
name: Step 10 - Authentication and Admin Shell
overview: ""
todos: []
isProject: false
---

# Step 10: Authentication and Admin Shell

## Goal

Secure the admin area and build the authenticated layout — the foundation for all management features. This step implements Supabase Auth (email/password), a protected `/admin` route group, an admin sidebar shell, and a Zustand store for client-side user state.

---

## Prerequisites

- Step 9 is complete: public pages fetch live data from Supabase.
- `@supabase/ssr` is installed (already present in Step 8 — `server.ts` and `client.ts` exist).
- Supabase project is running locally and an admin user has been created via the Supabase dashboard or CLI.
- All npm packages are already installed — `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`. No new packages needed.
- Shadcn components (`label`, `input`, `form`, `card`) are already installed. ✓

---

## Architecture Overview

### Route Group Restructuring

The root `src/app/layout.tsx` currently renders `<Navbar>` and `<Footer>` unconditionally. Admin pages must NOT show the public nav. The clean Next.js solution is route groups:

```
src/app/layout.tsx              ← minimal: html + body + font only (no Navbar/Footer)
src/app/(public)/layout.tsx     ← adds Navbar + Footer (wraps all public pages)
src/app/(public)/page.tsx       ← home (moved from app/page.tsx)
src/app/(public)/senseis/
src/app/(public)/horarios/
src/app/(public)/galeria/
src/app/(public)/campeonatos/
src/app/(public)/planos/
src/app/admin/layout.tsx        ← minimal admin wrapper (no Navbar/Footer)
src/app/admin/login/page.tsx    ← login form (no sidebar)
src/app/admin/(shell)/layout.tsx ← sidebar + header shell
src/app/admin/(shell)/page.tsx   ← redirects to /admin/dashboard
src/app/admin/(shell)/dashboard/page.tsx
src/app/admin/(shell)/content/page.tsx
src/app/admin/(shell)/students/page.tsx
src/app/admin/(shell)/finance/page.tsx
```

The `(public)` and `(shell)` route groups use parentheses so they do NOT appear in URLs. All existing public routes remain unchanged (`/senseis`, `/horarios`, etc.).

The login page lives outside `(shell)` so it renders without the sidebar.

---

## Implementation Order

Execute in this exact sequence to avoid broken intermediate states:

1. Add admin route constants to `src/lib/constants.ts`
2. Create `src/lib/supabase/middleware.ts`
3. Restructure route groups (riskiest step — verify public routes after this)
4. Create `src/app/admin/layout.tsx` (minimal)
5. Create `src/app/admin/login/page.tsx` and `src/app/admin/actions/login.ts`
6. Create `src/app/admin/actions/logout.ts`
7. Create `src/store/auth-store.ts`
8. Create `src/components/admin/auth-provider.tsx`
9. Create `src/components/admin/login-form.tsx`
10. Create `src/app/admin/(shell)/layout.tsx`
11. Create `src/components/admin/admin-sidebar.tsx`
12. Create `src/components/admin/admin-header.tsx`
13. Create placeholder pages (dashboard, content, students, finance)
14. Create `src/middleware.ts` (activate last, after login page works)
15. Create `tests/admin-auth.spec.ts`

---

## Task 1: Update `src/lib/constants.ts`

Add admin route constants so no component hardcodes paths:

```typescript
// existing
export const WHATSAPP_URL = "https://wa.me/5567992879411";

// new
export const ADMIN_ROUTES = {
  LOGIN: "/admin/login",
  DASHBOARD: "/admin/dashboard",
  CONTENT: "/admin/content",
  STUDENTS: "/admin/students",
  FINANCE: "/admin/finance",
} as const;
```

---

## Task 3: Supabase Middleware Client

**File:** `src/lib/supabase/middleware.ts`

The existing `server.ts` uses `cookies()` from `next/headers` — not available in middleware. Middleware requires a `NextRequest`/`NextResponse`-based cookie handler.

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";

export function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse,
) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );
}
```

**Key:** Cookies must be set on **both** `request` and `response` so the refreshed token is forwarded to the page and stored in the browser.

---

## Task 4: Route Group Restructuring

### 4a. Modify `src/app/layout.tsx`

Strip `<Navbar>` and `<Footer>`. Keep only `<html>`, `<body>`, font class, and metadata:

```typescript
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Dojo Luciano dos Santos Karate",
  description:
    "Disciplina, foco e autodefesa para todas as idades. Transforme sua mente e corpo com a tradição do verdadeiro Karate.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${lexend.variable} flex min-h-screen flex-col bg-background-light font-display antialiased text-slate-900 dark:bg-background-dark dark:text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
```

### 4b. Create `src/app/(public)/layout.tsx`

```typescript
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
```

### 4c. Move public page directories into `(public)/`

Move these directories (not copy — use `git mv` to preserve history):

- `src/app/page.tsx` → `src/app/(public)/page.tsx`
- `src/app/senseis/` → `src/app/(public)/senseis/`
- `src/app/horarios/` → `src/app/(public)/horarios/`
- `src/app/galeria/` → `src/app/(public)/galeria/`
- `src/app/campeonatos/` → `src/app/(public)/campeonatos/`
- `src/app/planos/` → `src/app/(public)/planos/`

**Verify after moving:** Run `npm run dev` and check that `/`, `/senseis`, `/horarios`, `/galeria`, `/campeonatos`, `/planos` all render correctly with Navbar and Footer.

---

## Task 5: Admin Layout (Minimal Wrapper)

**File:** `src/app/admin/layout.tsx`

This layout wraps ALL admin routes including the login page. It must be minimal — no sidebar.

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Dojo Luciano dos Santos",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

---

## Task 6: Login Server Action

**File:** `src/app/admin/actions/login.ts`

```typescript
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADMIN_ROUTES } from "@/lib/constants";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFormState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginFormState | undefined,
  formData: FormData,
): Promise<LoginFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "E-mail ou senha inválidos." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Credenciais inválidas. Verifique e-mail e senha." };
  }

  redirect(ADMIN_ROUTES.DASHBOARD);
}
```

**Key implementation notes:**

- `redirect()` from `next/navigation` throws internally — do NOT wrap it in try/catch.
- Never expose Supabase's specific error messages to the client (prevents user enumeration).
- Cookie setting works inside Server Actions because `next/headers` `cookies()` is writable in that context.

---

## Task 7: Logout Server Action

**File:** `src/app/admin/actions/logout.ts`

```typescript
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADMIN_ROUTES } from "@/lib/constants";

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(ADMIN_ROUTES.LOGIN);
}
```

---

## Task 8: Zustand Auth Store

**File:** `src/store/auth-store.ts`

```typescript
"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

No `persist` middleware — session is managed by Supabase cookies, not localStorage.

---

## Task 9: Auth Provider

**File:** `src/components/admin/auth-provider.tsx`

Hydrates the Zustand store and subscribes to auth state changes:

```typescript
"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
```

This component is mounted inside `src/app/admin/(shell)/layout.tsx`.

---

## Task 10: Login Form Component

**File:** `src/components/admin/login-form.tsx`

Uses React Hook Form (client-side validation) + Server Action (auth):

```typescript
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Swords } from "lucide-react";
import { loginAction } from "@/app/admin/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha com mínimo 6 caracteres"),
});
type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const [serverError, setServerError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: FormValues) {
    setServerError(undefined);
    const fd = new FormData();
    fd.append("email", values.email);
    fd.append("password", values.password);

    startTransition(async () => {
      const result = await loginAction(undefined, fd);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Swords className="size-8 text-primary" aria-hidden />
        </div>
        <CardTitle>Área Restrita</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@dojo.com"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p role="alert" className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p role="alert" className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

**File:** `src/app/admin/login/page.tsx`

```typescript
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Login | Admin Dojo",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <LoginForm />
    </div>
  );
}
```

---

## Task 11: Admin Shell Layout

**File:** `src/app/admin/(shell)/layout.tsx`

```typescript
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AuthProvider } from "@/components/admin/auth-provider";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
```

**File:** `src/app/admin/(shell)/page.tsx`

```typescript
import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/constants";

export default function AdminShellIndexPage() {
  redirect(ADMIN_ROUTES.DASHBOARD);
}
```

---

## Task 12: Admin Sidebar Component

**File:** `src/components/admin/admin-sidebar.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Dashboard",  href: ADMIN_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Conteúdo",   href: ADMIN_ROUTES.CONTENT,   icon: FileText },
  { label: "Alunos",     href: ADMIN_ROUTES.STUDENTS,  icon: Users },
  { label: "Financeiro", href: ADMIN_ROUTES.FINANCE,   icon: DollarSign },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-60 border-r border-border bg-sidebar shrink-0"
      aria-label="Admin navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
        <Swords className="size-6 text-primary" aria-hidden />
        <span className="font-bold text-sm text-sidebar-foreground">
          Dojo Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

**Note:** The sidebar uses `hidden md:flex` so it is visually hidden on mobile. A mobile hamburger menu (using Shadcn `Sheet`) can be added in a future step.

---

## Task 13: Admin Header Component

**File:** `src/components/admin/admin-header.tsx`

```typescript
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/admin/actions/logout";

export function AdminHeader() {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background shrink-0">
      <h1 className="text-sm font-semibold text-muted-foreground">
        Painel Administrativo
      </h1>
      <form action={logoutAction}>
        <Button variant="ghost" size="sm" type="submit">
          <LogOut className="size-4 mr-1" aria-hidden />
          Sair
        </Button>
      </form>
    </header>
  );
}
```

---

## Task 14: Placeholder Admin Pages

`**src/app/admin/(shell)/dashboard/page.tsx**`

```typescript
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard | Admin Dojo" };

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Bem-vindo, {user?.email}
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Resumo administrativo"
      >
        {[
          { label: "Alunos Ativos",   value: "—" },
          { label: "Novos Leads",     value: "—" },
          { label: "Campeonatos",     value: "—" },
          { label: "Receita (mês)",   value: "—" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card p-5 flex flex-col gap-1"
          >
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {label}
            </span>
            <span className="text-2xl font-bold text-card-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

`**src/app/admin/(shell)/content/page.tsx**`

```typescript
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Conteúdo | Admin Dojo" };
export default function ContentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Conteúdo</h1>
      <p className="text-muted-foreground mt-2">Em breve — Step 11.</p>
    </div>
  );
}
```

Repeat the same minimal pattern for `students/page.tsx` and `finance/page.tsx`.

---

## Task 15: Next.js Middleware

**File:** `src/middleware.ts`

Create last to avoid blocking development of the login page itself:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createSupabaseMiddlewareClient(request, response);

  // Always use getUser() not getSession() — validates token server-side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!user && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

**Why `getUser()` and not `getSession()`:** `getSession()` reads the JWT from cookie without validating it against Supabase servers — it can be spoofed. `getUser()` makes a server-side call to validate the token on every request. This is the security-critical distinction in `@supabase/ssr` documentation.

**Why the matcher includes `/admin/login`:** Including the login page in the matcher enables the "already authenticated → redirect to dashboard" behaviour. The check `if (user && isLoginPage)` handles this without needing to exclude the login page from the pattern.

---

## Task 16: E2E Tests

**File:** `tests/admin-auth.spec.ts`

> **Note:** `playwright.config.ts` sets `testDir: './tests'`. Tests go in `tests/`, NOT `e2e/`.

```typescript
import { test, expect } from "@playwright/test";

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
    await expect(
      page.getByRole("link", { name: /senseis/i }),
    ).not.toBeVisible();
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
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("shows error for wrong credentials", async ({ page }) => {
    await page.getByLabel("E-mail").fill("wrong@test.com");
    await page.getByLabel("Senha").fill("wrongpassword");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByRole("alert")).toContainText(/inválid/i);
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
  async function loginAndNavigate(page: Parameters<typeof test>[1]) {
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
```

---

## Quality Checklist

- `npm run build` passes with zero errors after all changes
- Unauthenticated access to `/admin/` redirects to `/admin/login`
- Unauthenticated access to `/admin/dashboard` redirects with `?redirectTo=/admin/dashboard`
- Successful login with valid credentials redirects to `/admin/dashboard`
- Invalid credentials show "Credenciais inválidas" error message
- Empty email shows client-side validation error (React Hook Form)
- Logout button clears session and redirects to `/admin/login`
- After logout, `/admin/dashboard` is protected again
- Admin sidebar renders 4 nav items: Dashboard, Conteúdo, Alunos, Financeiro
- Active nav item is highlighted (`aria-current="page"`)
- Sidebar is hidden on mobile (375px), visible on desktop (1280px)
- Login page does NOT render public `<Navbar>` or `<Footer>`
- All existing public routes (`/`, `/senseis`, `/horarios`, etc.) still work with Navbar + Footer
- `npm run test:e2e` passes all tests in `tests/admin-auth.spec.ts`

---

## Architectural Decisions

| Decision                                                 | Rationale                                                                                                               |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Route groups `(public)` and `(shell)`                    | Only way to have admin pages without inheriting root Navbar/Footer without conditional rendering hacks                  |
| `getUser()` not `getSession()` in middleware             | `getSession()` reads cookie without server validation — can be spoofed; `getUser()` validates token on every request    |
| No `profiles` table                                      | Existing RLS grants all authenticated users full CRUD access; single-admin use case doesn't need per-user roles yet     |
| Login page outside `(shell)` route group                 | Prevents sidebar from rendering on the login page without conditional display logic                                     |
| React Hook Form + `useTransition` (not `useActionState`) | RHF handles field-level validation state; `useTransition` calls the Server Action; separates client UX from server auth |
| Server Action for auth (not API route)                   | Server Actions can set cookies via `next/headers` — cleaner than API route pattern for Next.js 16                       |
| Zustand for auth store (not Context)                     | Already a dependency; avoids Context boilerplate; Zustand's `useAuthStore` is simpler and avoids re-renders             |
