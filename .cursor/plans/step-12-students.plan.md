---
name: Step 12 — Student Management
overview: Build the full student management module inside the admin area. Covers student registration, CRUD operations with search/filter, belt tracking, active/inactive status toggle, and a birthday report panel for the current month. All data is stored in the existing `students` Supabase table. Follows the established pattern of URL-driven Sheets, Server Actions, React Hook Form + Zod, and Sonner toasts.
todos:
  - id: s12-01
    content: "Phase 1: Types and constants — StudentInsert alias, BELT_OPTIONS in constants.ts"
    status: completed
  - id: s12-02
    content: "Phase 2: Zod validation schema — src/lib/validations/student-schema.ts"
    status: completed
  - id: s12-03
    content: "Phase 3: Service layer — src/services/students.ts (getStudents, getStudentById, getBirthdaysThisMonth)"
    status: completed
  - id: s12-04
    content: "Phase 4: Server Actions — src/app/admin/actions/student-actions.ts (create, update, delete, toggleActive)"
    status: completed
  - id: s12-05
    content: "Phase 5: Components — student-form, student-sheet, students-list, students-filter-bar, birthday-panel"
    status: completed
  - id: s12-06
    content: "Phase 6: Page — replace stub students/page.tsx, add loading.tsx"
    status: completed
  - id: s12-07
    content: "Phase 7: E2E tests — tests/admin-students.spec.ts (Playwright testDir)"
    status: completed
isProject: false
---

# Step 12 — Student Management

## Implementation status (completed)

All phases are implemented in the repo. Summary:

| Area | Notes |
|------|--------|
| Types / constants | `StudentInsert` in `src/types/database.ts`; `BELT_OPTIONS` / `BeltValue` in `src/lib/constants.ts`. |
| Validation | `src/lib/validations/student-schema.ts` matches the planned Zod shape. |
| Service | `src/services/students.ts` — filters, `getStudentById`, birthdays filtered in JS by month. Select results are asserted as `StudentRow[]` because `@supabase/postgrest-js` currently infers `from("students")` as `never` for this schema. |
| Server Actions | `src/app/admin/actions/student-actions.ts` — create/update/toggle use `as never` on payloads for the same typing quirk; runtime validation remains via Zod. |
| UI | All five components under `src/components/admin/students/`; URL-driven Sheet; filter bar with debounced search; `data-testid="belt-badge"` on faixa badges. |
| Page | `src/app/admin/(shell)/students/page.tsx` — parallel fetch of students, birthdays, plans; metadata title set. |
| Loading | `loading.tsx` uses a richer skeleton than the minimal snippet in this plan (header + filters + table). |
| E2E | `tests/admin-students.spec.ts` — uses `tests/` because `playwright.config.ts` sets `testDir: './tests'`. Authenticated tests call `loginAsAdmin` (same env defaults as `admin-auth.spec.ts`), run **serial** to avoid parallel DB races, use shadcn **Select** (`getByRole('combobox')` + options) for Faixa, and confirm delete via **`Excluir`** in the alert dialog (not “Confirmar”). Unauthenticated redirect for `/admin/students` remains covered in `tests/admin-auth.spec.ts`. |
| Deviations | Table is **not paginated** yet (full list). Belt URL example uses values like `preta-1`, not a bare `preta`. |
| Cleanup | Removed stray root `test-type.ts` that broke `tsc`. |

`pnpm build` passes with the typing workarounds above.

---

## Context

The `students` table was created in Step 8 and its `StudentRow` type exists in `src/types/database.ts`. The `students/page.tsx` route currently renders a one-line "Em breve" stub. The admin sidebar already links to `/admin/students`. This step replaces the stub with a fully operational student management module — the primary day-to-day operational tool for the dojo admin.

**No new Supabase migration is needed.** The existing schema covers all required fields:

```
students (id, name, email, phone, belt, plan_id, enrollment_date, birth_date, active, notes, created_at, updated_at)
```

---

## Architecture Decisions

### Route Structure

```
/admin/students                         → Students list + search + filter + birthday panel
/admin/students?search=João             → Filtered list by name
/admin/students?belt=preta-1            → Filtered by belt (values match `BELT_OPTIONS`)
/admin/students?active=inactive         → Inactive students
/admin/students?action=new              → Opens Sheet to create a student
/admin/students?action=edit&id=<uuid>   → Opens Sheet pre-filled to edit a student
```

Same URL-search-param-driven Sheet pattern used throughout Step 11 CMS modules. Deep-linkable, SSR-safe, no Zustand needed.

### UI Pattern

```
students/page.tsx (Server Component)
├── StudentsFilterBar  (Client)   — search input + belt select + active toggle
├── BirthdayPanel      (Client)   — collapsible card: students with bday this month
├── StudentsList       (Client)   — shadcn Table (full list; pagination optional later)
└── StudentSheet       (Client)   — Sheet slide-over containing StudentForm
    └── StudentForm    (Client)   — React Hook Form + Zod
```

The page fetches data on the server (passes URL search params as filter args to the service) and renders the pre-filtered list. Filter changes push new URL params, triggering a server-side re-fetch — no client-side state for the list itself.

### Belt Order (Karate)

```typescript
// src/lib/constants.ts — add this constant
export const BELT_OPTIONS = [
  { value: "branca", label: "Branca" },
  { value: "amarela", label: "Amarela" },
  { value: "laranja", label: "Laranja" },
  { value: "verde", label: "Verde" },
  { value: "azul", label: "Azul" },
  { value: "roxa", label: "Roxa" },
  { value: "marrom", label: "Marrom" },
  { value: "preta-1", label: "Preta 1º Dan" },
  { value: "preta-2", label: "Preta 2º Dan" },
  { value: "preta-3", label: "Preta 3º Dan" },
] as const;

export type BeltValue = (typeof BELT_OPTIONS)[number]["value"];
```

---

## Phase 1: Types and Constants

**Files to modify:**

### `src/types/database.ts`

Add the missing `StudentInsert` export alias (parallel to `SenseiInsert`, `PlanInsert`, etc.):

```typescript
export type StudentInsert = Omit<
  StudentRow,
  "id" | "created_at" | "updated_at"
>;
```

### `src/lib/constants.ts`

Append `BELT_OPTIONS` and `BeltValue` as shown in the Architecture section above. Do **not** alter `WHATSAPP_URL` or `ADMIN_ROUTES`.

---

## Phase 2: Zod Validation Schema

**New file:** `src/lib/validations/student-schema.ts`

```typescript
import { z } from "zod";

const BELT_VALUES = [
  "branca",
  "amarela",
  "laranja",
  "verde",
  "azul",
  "roxa",
  "marrom",
  "preta-1",
  "preta-2",
  "preta-3",
] as const;

export const studentSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  belt: z.enum(BELT_VALUES, { message: "Selecione uma faixa" }),
  plan_id: z.string().uuid("Plano inválido").optional().or(z.literal("")),
  enrollment_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (YYYY-MM-DD)"),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional()
    .or(z.literal("")),
  active: z.coerce.boolean(),
  notes: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;
```

**Coercion notes:**

- `active` uses `z.coerce.boolean()` because `FormData` serialises Switch/checkbox as `"true"`/`"false"` strings.
- Empty strings on optional fields use `.or(z.literal(""))` so the form can clear them without validation errors; the Server Action normalises them to `null` before inserting.

---

## Phase 3: Service Layer

**New file:** `src/services/students.ts`

```typescript
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StudentRow } from "@/types/database";

export interface StudentsFilter {
  search?: string;
  belt?: string;
  active?: "active" | "inactive" | "all";
}

export async function getStudents(
  filter: StudentsFilter = {},
): Promise<StudentRow[]>;

export async function getStudentById(id: string): Promise<StudentRow | null>;

export async function getBirthdaysThisMonth(): Promise<StudentRow[]>;
```

**Implementation details:**

- `getStudents`: builds a Supabase query on `students`, applies `ilike` on `name` if `search` is set, `eq` on `belt` if set, `eq` on `active` if not "all". Orders by `name ASC`.
- `getStudentById`: `select("*").eq("id", id).single()`.
- `getBirthdaysThisMonth`: selects active students where `EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)`. Since Supabase JS doesn't have a direct month-extraction filter, use `.filter("birth_date", "gte", firstDayOfMonth).filter("birth_date", "lte", lastDayOfMonth)` — but this only works if all birth years are considered. Better: fetch all active students with non-null birth_date and filter in JS by `new Date(s.birth_date).getMonth() === new Date().getMonth()`.

---

## Phase 4: Server Actions

**New file:** `src/app/admin/actions/student-actions.ts`

```typescript
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { studentSchema } from "@/lib/validations/student-schema";

type ActionResult = { success: true } | { error: string };

export async function createStudentAction(
  formData: FormData,
): Promise<ActionResult>;
export async function updateStudentAction(
  id: string,
  formData: FormData,
): Promise<ActionResult>;
export async function deleteStudentAction(id: string): Promise<ActionResult>;
export async function toggleStudentActiveAction(
  id: string,
  active: boolean,
): Promise<ActionResult>;
```

**Implementation notes:**

- `createStudentAction` / `updateStudentAction`:
  - Parse `FormData` with `studentSchema.safeParse(Object.fromEntries(formData))`.
  - Normalise empty strings to `null` for `email`, `phone`, `plan_id`, `birth_date`, `notes` before writing to DB.
  - Calls `revalidatePath("/admin/students")` on success.
- `deleteStudentAction`: `delete().eq("id", id)` then `revalidatePath`.
- `toggleStudentActiveAction`: `update({ active }).eq("id", id)` then `revalidatePath`. Used by an inline switch in the table row for fast status toggling without opening the Sheet.

---

## Phase 5: Components

All files go in `src/components/admin/students/`.

### `student-form.tsx` (Client)

React Hook Form + Zod, same structure as `schedule-form.tsx`. Fields layout:

```
Row 1: [Name (full width)]
Row 2: [Email] [Phone]
Row 3: [Belt (Select)] [Plan (Select, optional)]
Row 4: [Enrollment Date (date input)] [Birth Date (date input, optional)]
Row 5: [Active (Switch)]
Row 6: [Notes (Textarea, optional)]
[Save] [Cancel]
```

- Fetch plans for the Plan select: pass `plans` prop as `Array<{id: string; title: string}>` from the parent Sheet (server-fetched in the page, passed down).
- `Belt` select renders `BELT_OPTIONS` imported from `@/lib/constants`.
- `Active` uses shadcn `Switch` with a `FormField` wrapper; the value is coerced to boolean by Zod.
- `enrollment_date` defaults to today (`new Date().toISOString().split("T")[0]`).
- On submit: build `FormData`, call `createStudentAction` or `updateStudentAction`, show Sonner toast, call `onSuccess()`.

### `student-sheet.tsx` (Client)

Same URL-param-driven pattern as `schedule-sheet.tsx`:

```typescript
// Reads searchParams from URL: action=new | action=edit&id=xxx
// Renders <Sheet open={isOpen} onOpenChange={close}>
//   <SheetHeader><SheetTitle>{isNew ? "Novo Aluno" : "Editar Aluno"}</SheetTitle></SheetHeader>
//   <StudentForm student={student} plans={plans} onSuccess={close} />
// </Sheet>
```

Accepts `student?: StudentRow` and `plans: Array<{id: string; title: string}>` as props. The page component is responsible for fetching the student by ID (when `action=edit`) and passing it down.

### `students-list.tsx` (Client)

shadcn `Table` with the following columns:

| Column    | Content                                                                     |
| --------- | --------------------------------------------------------------------------- |
| Nome      | Student name (text)                                                         |
| Faixa     | Belt (colored `Badge`)                                                      |
| Telefone  | Phone number or "—"                                                         |
| Matrícula | `enrollment_date` formatted as dd/mm/yyyy                                   |
| Status    | `Badge` variant "default" (Ativo) / "secondary" (Inativo) + inline `Switch` |
| Ações     | `DropdownMenu` → Edit link (URL param) + Delete dialog                      |

Belt `Badge` color mapping (use `className` overrides):

```
branca  → bg-zinc-100 text-zinc-800
amarela → bg-yellow-100 text-yellow-800
laranja → bg-orange-100 text-orange-800
verde   → bg-green-100 text-green-800
azul    → bg-blue-100 text-blue-800
roxa    → bg-purple-100 text-purple-800
marrom  → bg-amber-800 text-white
preta-* → bg-zinc-900 text-white
```

Row actions:

- **Edit**: `Link` to `?action=edit&id=<id>` (same page, opens Sheet)
- **Delete**: `DeleteConfirmDialog` calling `deleteStudentAction(id)`
- **Active toggle**: inline `Switch` calling `toggleStudentActiveAction(id, !active)` with optimistic state

### `students-filter-bar.tsx` (Client)

```
[Search input — name search]  [Belt select — All/belts]  [Status select — All/Active/Inactive]
[+ Novo Aluno button]
```

All filters push new URL search params using `useRouter().push()`. The search input uses a debounced state (300ms) before pushing to avoid URL spam. The "Novo Aluno" button links to `?action=new`.

Uses shadcn `Input` and `Select` components. All labels in Portuguese.

### `birthday-panel.tsx` (Client)

A collapsible card (`<details>` element or shadcn `Card` with a toggle) showing students whose `birth_date` month matches the current month.

```
┌─────────────────────────────────────────────┐
│ 🎂 Aniversariantes do mês (N)          [▼]  │
├─────────────────────────────────────────────┤
│  Ana Silva       — Faixa Preta 1º Dan  — 15/03 │
│  Carlos Souza    — Faixa Verde         — 22/03 │
└─────────────────────────────────────────────┘
```

Receives `birthdays: StudentRow[]` as a prop (server-fetched in page). If empty, shows "Nenhum aniversariante este mês." Displays: name, belt badge, and day/month of birthday (never the year for privacy). If the list has more than 5 entries, add a "Ver todos (N)" toggle.

---

## Phase 6: Page

### `src/app/admin/(shell)/students/page.tsx`

Replace the stub. This is a **Server Component** that:

1. Reads `searchParams` (`search`, `belt`, `active`, `action`, `id`).
2. In parallel, fetches:

- `students = await getStudents({ search, belt, active })` from service
- `birthdays = await getBirthdaysThisMonth()` from service
- `plans` list (`id`, `title`) from Supabase directly (for the Sheet form select)
- If `action === "edit"` and `id` exists: `student = await getStudentById(id)`

1. Renders:

```tsx
<>
  <CmsPageHeader
    title="Alunos"
    description="Gerencie os alunos do dojo"
    action={
      <Link href="?action=new">
        <Button>+ Novo Aluno</Button>
      </Link>
    }
  />
  <BirthdayPanel birthdays={birthdays} />
  <StudentsFilterBar
    initialSearch={search}
    initialBelt={belt}
    initialActive={active}
  />
  <StudentsList students={students} />
  <StudentSheet
    isOpen={action === "new" || action === "edit"}
    student={student}
    plans={plans}
  />
</>
```

**Metadata export:**

```typescript
export const metadata: Metadata = {
  title: "Alunos | Admin Dojo",
};
```

### `src/app/admin/(shell)/students/loading.tsx`

Skeleton screen using the same pattern as other admin loading files:

```tsx
import { Skeleton } from "@/components/ui/skeleton";
export default function StudentsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
```

---

## Phase 7: E2E Tests

**File:** `tests/admin-students.spec.ts` (project `testDir` is `./tests`, not `e2e/`)

### Test Coverage

```typescript
import { test, expect } from "@playwright/test";

// `pnpm test-e2e` / Playwright uses testDir: ./tests (see playwright.config.ts).
// Unauthenticated redirect for /admin/students lives in tests/admin-auth.spec.ts.

async function loginAsAdmin(page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(process.env.TEST_ADMIN_EMAIL ?? "admin@dojo.test");
  await page.getByLabel("Senha").fill(process.env.TEST_ADMIN_PASSWORD ?? "testpassword");
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/admin(?!\/login)/);
}

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

  test("shows empty-state when no students match search", async ({ page }) => {
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
      // Sheet closes, new student appears in list
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
```

**Test file location:** `tests/admin-students.spec.ts`

---

## Quality Test Checklist

- Admin can create a new student and it appears in the list immediately (Server Action `revalidatePath` works)
- Belt filter correctly shows only students of the selected belt
- Search by name filters results (partial match, case-insensitive)
- Status filter (Active / Inactive) works correctly
- Belt promotion: editing a student's belt and saving updates the row immediately
- Birthday panel lists students with `birth_date` in the current month; when empty, shows the empty copy (panel stays visible)
- Form validation prevents saving: empty name, invalid email format, invalid date format
- Delete confirmation dialog appears and student is removed after confirmation
- Inline active toggle updates immediately without full page reload (optimistic switch + Server Action)
- Sheet opens from `?action=new` URL and from row Edit button
- Sheet closes after successful save and redirects back to list (clears URL params)
- `loading.tsx` skeleton renders during navigation to `/admin/students`
- `pnpm build` produces zero TypeScript errors

---

## Shadcn Components Required

All components below are already installed. No `pnpm dlx shadcn@latest add` needed:

- `table` ✓ — student list
- `sheet` ✓ — create/edit slide-over
- `form`, `input`, `select`, `switch`, `textarea` ✓ — form fields
- `badge` ✓ — belt color coding, active status
- `dropdown-menu` ✓ — row actions
- `alert-dialog` ✓ — delete confirmation (via existing `DeleteConfirmDialog`)
- `skeleton` ✓ — loading state
- `card` ✓ — birthday panel wrapper

The `date` field type on a plain `<input type="date">` is sufficient for `enrollment_date` and `birth_date`. No calendar/popover component needed.

---

## File Summary

| File                                                    | Action                           |
| ------------------------------------------------------- | -------------------------------- |
| `src/types/database.ts`                                 | Add `StudentInsert` type alias   |
| `src/lib/constants.ts`                                  | Add `BELT_OPTIONS` + `BeltValue` |
| `src/lib/validations/student-schema.ts`                 | **New** — Zod schema             |
| `src/services/students.ts`                              | **New** — service layer          |
| `src/app/admin/actions/student-actions.ts`              | **New** — Server Actions         |
| `src/components/admin/students/student-form.tsx`        | **New**                          |
| `src/components/admin/students/student-sheet.tsx`       | **New**                          |
| `src/components/admin/students/students-list.tsx`       | **New**                          |
| `src/components/admin/students/students-filter-bar.tsx` | **New**                          |
| `src/components/admin/students/birthday-panel.tsx`      | **New**                          |
| `src/app/admin/(shell)/students/page.tsx`               | **Replace** stub                 |
| `src/app/admin/(shell)/students/loading.tsx`            | **New**                          |
| `tests/admin-students.spec.ts`                          | **New** — E2E tests (Playwright `testDir`) |
