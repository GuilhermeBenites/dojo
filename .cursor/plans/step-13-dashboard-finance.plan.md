---
name: Step 13 — Dashboard and Financial Overview
overview: Wire the admin dashboard with real live data (KPI cards, recent leads, birthday count) and build the Finance page for tracking student payment status. Introduces a single DB migration (add `next_payment_date` to `students`), a new `dashboard` service, a `finance-actions` server action, and four new UI components. Both dashboard and finance stubs are fully replaced. Follows the project patterns — Server Components for data, Server Actions for mutations, URL-param-driven sheets, Sonner toasts.
todos:
  - id: s13-01
    content: "Phase 1: DB migration + types — add next_payment_date to students, update StudentRow / StudentInsert"
    status: completed
  - id: s13-02
    content: "Phase 2: Service layer — src/services/dashboard.ts (getDashboardStats, getRecentLeads) + update students.ts (getStudentsForFinance)"
    status: completed
  - id: s13-03
    content: "Phase 3: Server Action — src/app/admin/actions/finance-actions.ts (markStudentAsPaidAction)"
    status: completed
  - id: s13-04
    content: "Phase 4: Dashboard components — kpi-card.tsx, recent-leads-list.tsx"
    status: in_progress
  - id: s13-05
    content: "Phase 5: Finance component — payment-status-table.tsx"
    status: pending
  - id: s13-06
    content: "Phase 6: Pages — replace dashboard/page.tsx stub + finance/page.tsx stub, add loading.tsx to both"
    status: pending
  - id: s13-07
    content: "Phase 7: E2E tests — tests/admin-dashboard.spec.ts"
    status: pending
isProject: false
---

# Step 13 — Dashboard and Financial Overview

## Context

The admin area has been fully functional since Step 12 for student management and CMS, but the dashboard (`/admin/dashboard`) still shows stub `"—"` values and the finance page (`/admin/finance`) renders "Em breve." This step wires both pages with real Supabase data.

**Existing stubs to replace:**

| File                                       | Current state                         |
| ------------------------------------------ | ------------------------------------- |
| `src/app/admin/(shell)/dashboard/page.tsx` | Hardcoded KPI cards with `"—"` values |
| `src/app/admin/(shell)/finance/page.tsx`   | "Em breve" placeholder                |

**Database gap:** The `students` table has no payment tracking. A single `next_payment_date date` column is added via migration. No payments ledger is needed — the admin manually marks a student as paid, which sets the column to `today + 30 days`.

**No new shadcn components are required.** All UI primitives (`card`, `table`, `badge`, `button`, `dropdown-menu`, `alert-dialog`, `skeleton`) are already installed.

---

## Architecture Decisions

### Route Structure

```
/admin/dashboard       → KPI cards + recent leads + birthday link
/admin/finance         → Full student payment status table + mark-as-paid actions
```

Both remain **Server Components** at the page level; data is fetched on the server and passed as props. Client interactivity is isolated to leaf components.

### Payment Status Model

No full payment ledger. The `students` table gets one new column:

```
next_payment_date   date   nullable
```

Classification logic (computed client-side from the fetched date):

| Status    | Condition                            | Badge colour           |
| --------- | ------------------------------------ | ---------------------- |
| Vencido   | `next_payment_date < today`          | destructive (red)      |
| Vencendo  | `next_payment_date` within 7 days    | warning (yellow/amber) |
| Em dia    | `next_payment_date > today + 7 days` | success (green)        |
| Sem plano | `next_payment_date IS NULL`          | secondary (gray)       |

### KPI Cards (Dashboard)

| Card              | Query                                                                      |
| ----------------- | -------------------------------------------------------------------------- |
| Alunos Ativos     | `COUNT(*) FROM students WHERE active = true`                               |
| Novos Leads (mês) | `COUNT(*) FROM leads WHERE created_at >= first day of current month`       |
| Aniversariantes   | reuse `getBirthdaysThisMonth()` → `.length`                                |
| Inadimplentes     | `COUNT(*) FROM students WHERE active = true AND next_payment_date < today` |

---

## Phase 1: Database Migration + Types

### Migration

Run in Supabase SQL Editor (or add to your migrations folder):

```sql
ALTER TABLE students
  ADD COLUMN next_payment_date date;
```

No default — existing rows get `NULL` (classified as "Sem plano"). The admin sets this field per-student when they mark a payment.

### `src/types/database.ts`

Add `next_payment_date` to `StudentRow`:

```typescript
export interface StudentRow {
  // ... existing fields ...
  next_payment_date: string | null; // ISO date "YYYY-MM-DD"
}
```

`StudentInsert` is already derived from `StudentRow` via `Omit<StudentRow, "id" | "created_at" | "updated_at">`, so it automatically picks up the new field — no change needed there.

---

## Phase 2: Service Layer

### New file: `src/services/dashboard.ts`

```typescript
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadRow } from "@/types/database";

export interface DashboardStats {
  activeStudents: number;
  newLeadsThisMonth: number;
  birthdaysThisMonth: number;
  overduePayments: number;
}

export async function getDashboardStats(
  birthdayCount: number,
): Promise<DashboardStats>;
```

**Implementation details:**

- `activeStudents`: `supabase.from("students").select("*", { count: "exact", head: true }).eq("active", true)` — use `head: true` to avoid fetching rows.
- `newLeadsThisMonth`: filter `created_at >= firstDayOfCurrentMonth`. Build the ISO string with `new Date(year, month, 1).toISOString()`.
- `overduePayments`: `supabase.from("students").select("*", { count: "exact", head: true }).eq("active", true).lt("next_payment_date", todayISO)` where `todayISO = new Date().toISOString().split("T")[0]`.
- `birthdaysThisMonth`: passed in from the caller (already fetched by `getBirthdaysThisMonth()`).

```typescript
export async function getRecentLeads(limit = 5): Promise<LeadRow[]>;
```

**Implementation:** `supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(limit)`.

### Modify: `src/services/students.ts`

Add `getStudentsForFinance()`:

```typescript
export async function getStudentsForFinance(): Promise<StudentRow[]>;
```

**Implementation:** Fetches all active students, ordered by `next_payment_date ASC NULLS LAST` (overdue and expiring first, sem-plano last). Query:

```typescript
supabase
  .from("students")
  .select("id, name, belt, plan_id, next_payment_date, phone")
  .eq("active", true)
  .order("next_payment_date", { ascending: true, nullsFirst: false });
```

---

## Phase 3: Server Action

### New file: `src/app/admin/actions/finance-actions.ts`

```typescript
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionResult = { success: true } | { error: string };

/**
 * Marks a student as paid by setting next_payment_date to today + months * 30 days.
 * months defaults to 1 (standard monthly payment).
 */
export async function markStudentAsPaidAction(
  studentId: string,
  months: number = 1,
): Promise<ActionResult>;
```

**Implementation notes:**

- Compute `nextDate`: `new Date()` + `months * 30` days → `.toISOString().split("T")[0]`.
- `supabase.from("students").update({ next_payment_date: nextDate }).eq("id", studentId)`.
- `revalidatePath("/admin/finance")` and `revalidatePath("/admin/dashboard")` on success.
- Return `{ error: error.message }` on failure.

No Zod schema needed — `studentId` is a UUID from the DB row and `months` is an integer from a controlled select.

---

## Phase 4: Dashboard Components

All files go in `src/components/admin/dashboard/`.

### `kpi-card.tsx` (Server-safe, no `"use client"`)

A presentational card component accepting typed props:

```typescript
interface KpiCardProps {
  label: string;
  value: number | string;
  description?: string;
  href?: string; // Optional link for "Ver todos" CTA
  variant?: "default" | "danger" | "warning";
}
```

Visual structure (mirrors the existing stub card markup in `dashboard/page.tsx` but styled):

```
┌──────────────────────────────┐
│  LABEL (xs, muted, uppercase)│
│  VALUE (2xl bold)            │
│  description (xs muted)      │
│  [Ver todos →] (optional)    │
└──────────────────────────────┘
```

- `variant="danger"`: applies `border-destructive` and `text-destructive` on value — used for Inadimplentes when count > 0.
- `variant="warning"`: `border-amber-400 text-amber-700` — not used in step 13 but supports future use.
- Import from `@/components/ui/card` for the outer shell.

### `recent-leads-list.tsx` (Client — needs `useTransition` for delete)

```typescript
interface RecentLeadsListProps {
  leads: LeadRow[];
}
```

Renders a `Card` containing a shadcn `Table` (no full-page table; just the recent 5):

| Column   | Content                                    |
| -------- | ------------------------------------------ |
| Nome     | Lead name                                  |
| Telefone | Phone number                               |
| Fonte    | `source` badge                             |
| Data     | `created_at` formatted as dd/mm/yyyy HH:mm |
| Ações    | WhatsApp icon button + Delete              |

**WhatsApp quick action:** Renders an `<a>` with `href="https://wa.me/55{phone.replace(/\D/g, '')}"` and `target="_blank"` — uses the same WhatsApp URL pattern as `WHATSAPP_URL` in `constants.ts`.

**Delete:** Calls `deleteLeadAction` (see below). Uses `DeleteConfirmDialog` from `@/components/admin/cms/delete-confirm-dialog`.

Add `deleteLeadAction` to `finance-actions.ts`:

```typescript
export async function deleteLeadAction(id: string): Promise<ActionResult>;
// supabase.from("leads").delete().eq("id", id)
// revalidatePath("/admin/dashboard")
```

If leads are empty, show:

```
<p className="text-muted-foreground text-sm py-4 text-center">Nenhum lead registrado.</p>
```

---

## Phase 5: Finance Component

File: `src/components/admin/finance/payment-status-table.tsx` (Client)

```typescript
interface PaymentStatusTableProps {
  students: StudentRow[];
  plans: Array<{ id: string; title: string }>;
}
```

### Payment status helper (defined at module top, not exported):

```typescript
type PaymentStatus = "vencido" | "vencendo" | "em-dia" | "sem-plano";

function getPaymentStatus(nextPaymentDate: string | null): PaymentStatus {
  if (!nextPaymentDate) return "sem-plano";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(nextPaymentDate);
  const daysUntilDue = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysUntilDue < 0) return "vencido";
  if (daysUntilDue <= 7) return "vencendo";
  return "em-dia";
}
```

### Status badge config:

```typescript
const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  vencido: {
    label: "Vencido",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  vencendo: {
    label: "Vencendo",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  "em-dia": {
    label: "Em dia",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  "sem-plano": { label: "Sem plano", className: "bg-zinc-100 text-zinc-600" },
};
```

### Table columns:

| Column          | Content                                                        |
| --------------- | -------------------------------------------------------------- |
| Aluno           | Student name                                                   |
| Faixa           | Belt badge (reuse belt color mapping from `students-list.tsx`) |
| Plano           | Plan title or "—"                                              |
| Próx. Pagamento | `next_payment_date` formatted as dd/mm/yyyy, or "—"            |
| Status          | Colored Badge per `STATUS_CONFIG`                              |
| Ações           | "Marcar Pago" dropdown (1 mês / 2 meses / 3 meses)             |

### "Marcar Pago" interaction:

A `DropdownMenu` with three items:

- "1 mês" → `markStudentAsPaidAction(id, 1)`
- "2 meses" → `markStudentAsPaidAction(id, 2)`
- "3 meses" → `markStudentAsPaidAction(id, 3)`

Uses `useTransition` for the server action call; show a Sonner toast on success/error. The row updates via `revalidatePath` (server-side) so the page re-renders after transition.

### Summary row (above the table):

```
3 vencidos · 2 vencendo · 18 em dia · 4 sem plano
```

Computed from `students` prop. Rendered as a row of colored badge-like `<span>` elements above the table.

---

## Phase 6: Pages

### `src/app/admin/(shell)/dashboard/page.tsx`

Replace the stub entirely. This is a **Server Component**:

1. Fetch in parallel:
   - `birthdays = await getBirthdaysThisMonth()` (students service)
   - `recentLeads = await getRecentLeads(5)` (dashboard service)
   - `stats = await getDashboardStats(birthdays.length)` (dashboard service)

2. Render:

```tsx
<div className="flex flex-col gap-6">
  <div>
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p className="text-muted-foreground text-sm mt-1">
      Bem-vindo, {user?.email}
    </p>
  </div>

  {/* KPI Grid — 4 cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <KpiCard
      label="Alunos Ativos"
      value={stats.activeStudents}
      href="/admin/students"
    />
    <KpiCard label="Novos Leads (mês)" value={stats.newLeadsThisMonth} />
    <KpiCard
      label="Aniversariantes"
      value={stats.birthdaysThisMonth}
      href="/admin/students"
      description="este mês"
    />
    <KpiCard
      label="Inadimplentes"
      value={stats.overduePayments}
      href="/admin/finance"
      variant={stats.overduePayments > 0 ? "danger" : "default"}
    />
  </div>

  {/* Recent Leads */}
  <div>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold">Leads Recentes</h2>
      <Link
        href="/admin/finance"
        className="text-sm text-muted-foreground hover:underline"
      >
        Ver financeiro →
      </Link>
    </div>
    <RecentLeadsList leads={recentLeads} />
  </div>
</div>
```

**Metadata export:**

```typescript
export const metadata: Metadata = {
  title: "Dashboard | Admin Dojo",
};
```

### `src/app/admin/(shell)/dashboard/loading.tsx`

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
```

### `src/app/admin/(shell)/finance/page.tsx`

Replace the stub entirely. **Server Component**:

1. Fetch in parallel:
   - `students = await getStudentsForFinance()` (returns active students ordered by next_payment_date)
   - `plans = await getPlans()` from `src/services/plans.ts` (for the plan name lookup)

2. Render:

```tsx
<div className="flex flex-col gap-6">
  <CmsPageHeader
    title="Financeiro"
    description="Acompanhe o status de pagamento dos alunos ativos"
  />
  <PaymentStatusTable students={students} plans={plans} />
</div>
```

**Metadata export:**

```typescript
export const metadata: Metadata = {
  title: "Financeiro | Admin Dojo",
};
```

### `src/app/admin/(shell)/finance/loading.tsx`

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function FinanceLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-6 w-64" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
```

---

## Phase 7: E2E Tests

**File:** `tests/admin-dashboard.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

async function loginAsAdmin(page) {
  await page.goto("/admin/login");
  await page
    .getByLabel("E-mail")
    .fill(process.env.TEST_ADMIN_EMAIL ?? "admin@dojo.test");
  await page
    .getByLabel("Senha")
    .fill(process.env.TEST_ADMIN_PASSWORD ?? "testpassword");
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
    // Each KPI card value should be a number, not "—"
    const cards = page.locator(
      '[aria-label="Resumo administrativo"] .text-2xl',
    );
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
    await expect(
      page.getByRole("columnheader", { name: "Aluno" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Status" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Próx. Pagamento" }),
    ).toBeVisible();
  });

  test("mark-as-paid updates student payment date", async ({ page }) => {
    await page.goto("/admin/finance");
    // Click first available "Marcar Pago" dropdown
    const firstActionBtn = page
      .getByRole("button", { name: /marcar pago/i })
      .first();
    // Only run if there is at least one student
    const count = await firstActionBtn.count();
    if (count > 0) {
      await firstActionBtn.click();
      await page.getByRole("menuitem", { name: "1 mês" }).click();
      // Sonner toast should confirm success
      await expect(page.getByText(/pago|atualizado/i)).toBeVisible({
        timeout: 5000,
      });
    }
  });
});
```

---

## Quality Test Checklist

- Dashboard KPI cards show numeric values (not `"—"`) sourced from the live DB
- "Inadimplentes" card turns red when count > 0
- Recent leads table shows the last 5 leads ordered by newest first
- WhatsApp quick action opens the correct `wa.me` link in a new tab
- Delete lead removes it from the list (revalidatePath triggers a fresh render)
- Finance page loads without error even when all students have `next_payment_date = NULL` (all shown as "Sem plano")
- "Marcar Pago → 1 mês" sets `next_payment_date` to today + 30 days; badge changes to "Em dia"
- "Marcar Pago → 3 meses" sets `next_payment_date` to today + 90 days; badge shows "Em dia"
- Summary row (e.g. "3 vencidos · 2 vencendo") matches the actual badge counts in the table
- `loading.tsx` skeletons appear while navigating to `/admin/dashboard` and `/admin/finance`
- `pnpm build` produces zero TypeScript errors
- E2E tests pass: `pnpm test-e2e --grep "dashboard|finance"`

---

## Shadcn Components Required

All already installed — no `pnpm dlx shadcn@latest add` commands needed.

| Component       | Used in                                                  |
| --------------- | -------------------------------------------------------- |
| `card`          | `KpiCard`, `RecentLeadsList` wrapper                     |
| `table`         | `RecentLeadsList`, `PaymentStatusTable`                  |
| `badge`         | Payment status, belt color, lead source                  |
| `button`        | KpiCard CTA, "Marcar Pago"                               |
| `dropdown-menu` | "Marcar Pago" (1/2/3 meses)                              |
| `alert-dialog`  | Delete lead confirm (via existing `DeleteConfirmDialog`) |
| `skeleton`      | Both `loading.tsx` files                                 |

---

## File Summary

| File                                                    | Action                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------ |
| Supabase SQL                                            | **Migration** — `ALTER TABLE students ADD COLUMN next_payment_date date` |
| `src/types/database.ts`                                 | Add `next_payment_date: string \| null` to `StudentRow`                  |
| `src/services/dashboard.ts`                             | **New** — `getDashboardStats`, `getRecentLeads`                          |
| `src/services/students.ts`                              | Add `getStudentsForFinance()`                                            |
| `src/app/admin/actions/finance-actions.ts`              | **New** — `markStudentAsPaidAction`, `deleteLeadAction`                  |
| `src/components/admin/dashboard/kpi-card.tsx`           | **New**                                                                  |
| `src/components/admin/dashboard/recent-leads-list.tsx`  | **New**                                                                  |
| `src/components/admin/finance/payment-status-table.tsx` | **New**                                                                  |
| `src/app/admin/(shell)/dashboard/page.tsx`              | **Replace** stub                                                         |
| `src/app/admin/(shell)/dashboard/loading.tsx`           | **New**                                                                  |
| `src/app/admin/(shell)/finance/page.tsx`                | **Replace** stub                                                         |
| `src/app/admin/(shell)/finance/loading.tsx`             | **New**                                                                  |
| `tests/admin-dashboard.spec.ts`                         | **New** — E2E tests                                                      |
