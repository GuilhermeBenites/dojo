---
name: Step 11 — Admin CMS (Content Management)
overview: Build full CRUD management for all public-facing content inside the admin area. Covers Schedules, Senseis, Gallery, Championships, Testimonials, and Plans. Uses Server Actions for mutations, React Hook Form + Zod for validation, Shadcn Sheet slide-overs for create/edit, and Supabase Storage for image uploads. All mutations call revalidatePath so public pages reflect changes immediately.
todos:
  - id: s11-01
    content: "Phase 1: Install shadcn components and create shared CMS infrastructure"
    status: pending
  - id: s11-02
    content: "Phase 2: Create Zod validation schemas for all six entities"
    status: pending
  - id: s11-03
    content: "Phase 3: Create Server Actions for all mutations (create/update/delete)"
    status: pending
  - id: s11-04
    content: "Phase 4: Build Content Hub page (replace stub, section navigation cards)"
    status: pending
  - id: s11-05
    content: "Phase 5: Schedules CRUD — list table, create/edit Sheet, delete dialog"
    status: pending
  - id: s11-06
    content: "Phase 6: Senseis CRUD — list table, form with Supabase Storage image upload"
    status: pending
  - id: s11-07
    content: "Phase 7: Gallery CRUD — thumbnail grid, image upload, reorder"
    status: pending
  - id: s11-08
    content: "Phase 8: Championships CRUD — event list + form + nested results management"
    status: pending
  - id: s11-09
    content: "Phase 9: Testimonials CRUD — simple list + form"
    status: pending
  - id: s11-10
    content: "Phase 10: Plans CRUD — tabbed view (Plans + Belt Exams + Drop-in + FAQ)"
    status: pending
  - id: s11-11
    content: "Phase 11: Polish — add Sonner toast provider, loading skeletons, empty states"
    status: pending
  - id: s11-12
    content: "Phase 12: E2E tests — admin-cms.spec.ts with Playwright"
    status: pending
isProject: false
---

# Step 11 — Admin CMS (Content Management)

## Context

All six public-facing content tables already exist in Supabase (schema + RLS + seed
data are complete from Step 8). The services layer reads data for public pages. The
admin shell (sidebar, header, auth) is working from Step 10. This step wires the admin
`/content/*` routes to full CRUD, closing the loop so the admin can manage all content
without touching the codebase.

**Current state:** `/admin/content` is a stub that shows "Em breve — Step 11."

---

## Architecture Decisions

### Route Structure

```
/admin/content                       → Hub: 6 section cards with links
/admin/content/schedules             → Schedule list + Sheet
/admin/content/senseis               → Sensei list + Sheet
/admin/content/gallery               → Gallery thumbnail grid + upload Sheet
/admin/content/championships         → Championship list + Sheet + nested results
/admin/content/testimonials          → Testimonial list + Sheet
/admin/content/plans                 → Tabbed page: Plans | Belt Exams | Drop-in | FAQ
```

### UI Pattern: List + Sheet (Slide-over)

Every section follows the same spatial pattern:

1. **List view** — server component, fetches data via Supabase server client, renders a table or grid
2. **Sheet slide-over** — opens when "New" or "Edit" is clicked; houses the React Hook Form; driven by URL search-param (`?action=new` / `?action=edit&id=xxx`) so it is deep-linkable and SSR-safe
3. **AlertDialog** — triggered by the "Delete" row action; asks confirmation before calling Server Action

Using URL-based Sheet state avoids needing Zustand for CMS and makes the UI sharable.

### Mutation Pattern: Server Actions + revalidatePath

```
src/app/admin/actions/
  schedules-actions.ts
  senseis-actions.ts
  gallery-actions.ts
  championships-actions.ts
  testimonials-actions.ts
  plans-actions.ts
```

Each file is `"use server"`. After every mutation it calls:

- `revalidatePath("/admin/content/<section>")` — refreshes list
- `revalidatePath("/<public-route>")` — refreshes public page immediately

Return type pattern:

```ts
type ActionResult = { success: true } | { error: string };
```

Client components call the action, inspect the result, show a Sonner toast, and close
the Sheet on success.

### Image Upload Strategy (Senseis + Gallery)

Image upload is a two-step client-side flow using the browser Supabase client:

1. User selects file with `<input type="file">`
2. `ImageUpload` component uploads to Supabase Storage (`senseis/` or `gallery/` bucket)
   and stores the returned public URL in React state
3. The URL is passed as a hidden field when the form is submitted to the Server Action

The `ImageUpload` component handles: file validation (type + 5 MB / 10 MB limit),
upload progress indicator, preview thumbnail, and error state.

### Plans Tiers Editor

The `tiers` column is `JSONB` with this shape:

```ts
Array<{
  label: string;
  price: string;
  isMonthlyHighlight: boolean;
  suffix?: string;
}>;
```

A `PlanTiersEditor` client component renders a list of tier rows (each with label,
price, isMonthlyHighlight switch, optional suffix). Rows can be added and removed.
The array is serialised as JSON and submitted as a hidden textarea field.

---

## Phase 1: Shared Infrastructure

### 1.1 Install Shadcn Components

Run in order (each installs its Radix peer):

```bash
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add alert-dialog
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add sonner
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add skeleton
pnpm dlx shadcn@latest add tooltip
```

**New files:** `src/components/ui/{table,alert-dialog,select,textarea,sonner,badge,separator,tabs,switch,dropdown-menu,skeleton,tooltip}.tsx`

### 1.2 Add Sonner Provider to Admin Layout

Edit `src/app/admin/(shell)/layout.tsx` — add `<Toaster />` from `sonner` inside
`AuthProvider`, after `<main>`:

```tsx
import { Toaster } from "@/components/ui/sonner";
// …inside JSX after <main>…
<Toaster richColors position="top-right" />;
```

### 1.3 Create Shared CMS Components

`**src/components/admin/cms/cms-page-header.tsx**`
Props: `title: string`, `description?: string`, `action?: ReactNode`
Renders: `<h1>` + muted `<p>` + optional right-aligned button slot (for "New" button).

`**src/components/admin/cms/cms-back-link.tsx**`
Props: `href: string`, `label: string`
Renders a small `←` link for sub-section navigation.

`**src/components/admin/cms/delete-confirm-dialog.tsx**`
Client component.
Props: `trigger: ReactNode`, `title: string`, `description: string`,
`action: () => Promise<ActionResult>`, `onSuccess?: () => void`
Uses Shadcn `AlertDialog`. Calls action on confirm, shows Sonner toast on result.

`**src/components/admin/cms/image-upload.tsx**`
Client component.
Props: `bucket: "senseis" | "gallery"`, `value?: string`, `onChange: (url: string) => void`
Renders: file input, preview thumbnail (if `value` set), upload progress bar.
Behaviour: validates `image/*` MIME + size limit → uploads via `createSupabaseBrowserClient()` → calls `onChange(publicUrl)`.

`**src/components/admin/cms/order-controls.tsx**`
Props: `onMoveUp: () => void`, `onMoveDown: () => void`, `isFirst: boolean`, `isLast: boolean`
Renders two icon buttons (`ChevronUp` / `ChevronDown`), disabled at boundaries.
Used in any list that supports display_order reordering.

---

## Phase 2: Validation Schemas

**Directory:** `src/lib/validations/`

### `schedule-schema.ts`

```ts
z.object({
  day_group_id: z.string().min(1), // e.g. "seg-qua-sex"
  day_label: z.string().min(1), // e.g. "Seg / Qua / Sex"
  time_start: z.string().regex(/^\d{2}:\d{2}$/),
  time_end: z.string().regex(/^\d{2}:\d{2}$/),
  category: z.enum(["infantil", "adultos"]),
  instructor: z.string().optional(),
  display_order: z.coerce.number().int().min(0),
});
```

### `sensei-schema.ts`

```ts
z.object({
  name: z.string().min(2).max(100),
  rank: z.string().min(2).max(100),
  specialty: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  quote: z.string().max(500).optional(),
  organization: z.string().max(200).optional(),
  photo_url: z.string().url().optional().or(z.literal("")),
  is_founder: z.boolean().default(false),
  display_order: z.coerce.number().int().min(0),
});
```

### `gallery-schema.ts`

```ts
z.object({
  title: z.string().min(1).max(200),
  category: z.enum(["sensei-luciano", "belt-ceremonies", "kids", "dojo"]),
  image_url: z.string().url(),
  aspect_ratio: z.enum(["square", "portrait", "landscape"]).default("square"),
  display_order: z.coerce.number().int().min(0),
});
```

### `championship-schema.ts`

```ts
z.object({
  name: z.string().min(2).max(200),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().min(2).max(200),
  status: z.enum(["finalizado", "em-andamento", "futuro"]),
  gold: z.coerce.number().int().min(0),
  silver: z.coerce.number().int().min(0),
  bronze: z.coerce.number().int().min(0),
  display_order: z.coerce.number().int().min(0),
});

// Separate schema for results
z.object({
  championship_id: z.string().uuid(),
  athlete_name: z.string().min(2).max(100),
  placement: z.coerce.number().int().min(1).max(3),
  category: z.string().min(1).max(100),
});
```

### `testimonial-schema.ts`

```ts
z.object({
  author: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  quote: z.string().min(10).max(500),
  display_order: z.coerce.number().int().min(0),
});
```

### `plan-schema.ts`

```ts
// Plan
z.object({
  plan_key: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(100),
  subtitle: z.string().max(200).optional(),
  recommended: z.boolean().default(false),
  tiers: z.string().transform((val) => JSON.parse(val)), // JSON textarea
  display_order: z.coerce.number().int().min(0),
});

// Belt Exam (update only — no create/delete)
z.object({
  belt: z.string().min(1),
  price: z.string().min(1),
  family_price: z.string().min(1),
  highlighted: z.boolean().default(false),
  display_order: z.coerce.number().int().min(0),
});

// Drop-in (update only)
z.object({
  label: z.string().min(1).max(100),
  price: z.string().min(1),
  display_order: z.coerce.number().int().min(0),
});

// FAQ item
z.object({
  question: z.string().min(5).max(300),
  answer: z.string().min(10).max(2000),
  display_order: z.coerce.number().int().min(0),
});
```

---

## Phase 3: Server Actions

### Pattern (applied to every action file)

```ts
"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SomeSchema } from "@/lib/validations/some-schema";

export async function createSomethingAction(
  formData: FormData,
): Promise<{ success: true } | { error: string }> {
  const raw = Object.fromEntries(formData);
  const parsed = SomeSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("table_name").insert(parsed.data);
  if (error) return { error: error.message };

  revalidatePath("/admin/content/section");
  revalidatePath("/public-page");
  return { success: true };
}
```

### `src/app/admin/actions/schedules-actions.ts`

| Action                         | Supabase op              | revalidatePaths                         |
| ------------------------------ | ------------------------ | --------------------------------------- |
| `createScheduleAction(fd)`     | `.insert()`              | `/admin/content/schedules`, `/horarios` |
| `updateScheduleAction(id, fd)` | `.update().eq("id", id)` | same                                    |
| `deleteScheduleAction(id)`     | `.delete().eq("id", id)` | same                                    |

### `src/app/admin/actions/senseis-actions.ts`

| Action                                            | Notes                                                          |
| ------------------------------------------------- | -------------------------------------------------------------- |
| `createSenseiAction(fd)`                          | photo_url comes from ImageUpload (already uploaded to Storage) |
| `updateSenseiAction(id, fd)`                      | —                                                              |
| `deleteSenseiAction(id)`                          | Also removes Storage file if photo_url is set                  |
| revalidates: `/admin/content/senseis`, `/senseis` | —                                                              |

### `src/app/admin/actions/gallery-actions.ts`

| Action                                            | Notes                                  |
| ------------------------------------------------- | -------------------------------------- |
| `createGalleryImageAction(fd)`                    | image_url already uploaded client-side |
| `updateGalleryImageAction(id, fd)`                | Can replace image_url                  |
| `deleteGalleryImageAction(id)`                    | Also removes Storage file              |
| `reorderGalleryAction(id, dir)`                   | Swaps display_order with adjacent row  |
| revalidates: `/admin/content/gallery`, `/galeria` | —                                      |

### `src/app/admin/actions/championships-actions.ts`

| Action                                                      | Supabase op                        |
| ----------------------------------------------------------- | ---------------------------------- |
| `createChampionshipAction(fd)`                              | insert into `championships`        |
| `updateChampionshipAction(id, fd)`                          | update                             |
| `deleteChampionshipAction(id)`                              | delete (cascades results via FK)   |
| `createResultAction(fd)`                                    | insert into `championship_results` |
| `deleteResultAction(id)`                                    | delete result                      |
| revalidates: `/admin/content/championships`, `/campeonatos` | —                                  |

### `src/app/admin/actions/testimonials-actions.ts`

| Action                                          | Supabase op |
| ----------------------------------------------- | ----------- |
| `createTestimonialAction(fd)`                   | insert      |
| `updateTestimonialAction(id, fd)`               | update      |
| `deleteTestimonialAction(id)`                   | delete      |
| revalidates: `/admin/content/testimonials`, `/` | —           |

### `src/app/admin/actions/plans-actions.ts`

| Action                                         | Table                                  |
| ---------------------------------------------- | -------------------------------------- |
| `createPlanAction(fd)`                         | `plans` (tiers is JSON-parsed from fd) |
| `updatePlanAction(id, fd)`                     | `plans`                                |
| `deletePlanAction(id)`                         | `plans`                                |
| `updateBeltExamAction(id, fd)`                 | `belt_exams`                           |
| `updateDropInAction(id, fd)`                   | `drop_in_classes`                      |
| `createFaqAction(fd)`                          | `faq_items`                            |
| `updateFaqAction(id, fd)`                      | `faq_items`                            |
| `deleteFaqAction(id)`                          | `faq_items`                            |
| revalidates: `/admin/content/plans`, `/planos` | —                                      |

---

## Phase 4: Content Hub Page

**File:** `src/app/admin/(shell)/content/page.tsx` (replace stub)

Server component. Renders a 2×3 grid of `<Link>` cards, one per section.

Each card shows:

- Section icon (Lucide icon)
- Section title (PT)
- One-line description
- "Gerenciar →" text

| Section     | Route                          | Icon            | Description                 |
| ----------- | ------------------------------ | --------------- | --------------------------- |
| Horários    | `/admin/content/schedules`     | `CalendarDays`  | Turmas e horários das aulas |
| Senseis     | `/admin/content/senseis`       | `Users`         | Instrutores e perfis        |
| Galeria     | `/admin/content/gallery`       | `Images`        | Fotos do dojo               |
| Campeonatos | `/admin/content/championships` | `Trophy`        | Eventos e resultados        |
| Depoimentos | `/admin/content/testimonials`  | `MessageSquare` | Avaliações de alunos        |
| Planos      | `/admin/content/plans`         | `CreditCard`    | Preços e planos             |

---

## Phase 5: Schedules CRUD

### Files

```
src/app/admin/(shell)/content/schedules/page.tsx
src/components/admin/cms/schedules/schedules-list.tsx
src/components/admin/cms/schedules/schedule-sheet.tsx
src/components/admin/cms/schedules/schedule-form.tsx
```

### `page.tsx`

Server component. Fetches all schedules with `createSupabaseServerClient()`:

```ts
const { data: schedules } = await supabase
  .from("schedules")
  .select("*")
  .order("display_order");
```

Renders `<CmsPageHeader>` + "New Schedule" button (sets `?action=new`) + `<SchedulesList>`.

Reads `searchParams` for `action` and `id` to pass to `<ScheduleSheet>`.

### `schedules-list.tsx`

Client component. Renders a `<Table>` with columns:

| Day Label | Time | Category | Instructor | Order | Actions |
| --------- | ---- | -------- | ---------- | ----- | ------- |

- Category shown as `<Badge>` (infantil = blue, adultos = red)
- Actions column: `<DropdownMenu>` with "Edit" (sets `?action=edit&id=xxx`) and "Delete"
  ("Delete" triggers `<DeleteConfirmDialog>`)

### `schedule-sheet.tsx`

Client component. Controlled by `action` and `id` from URL.
Opens Shadcn `<Sheet>` with `<ScheduleForm>` inside.
On form success: calls `router.push("/admin/content/schedules")` to close.

### `schedule-form.tsx`

Client component. Uses `useForm<ScheduleFormData>` + `zodResolver(ScheduleSchema)`.

**Fields:**

- `day_group_id` — `<Input>` (text, e.g. "seg-qua-sex")
- `day_label` — `<Input>` (display text, e.g. "Seg / Qua / Sex")
- `time_start`, `time_end` — `<Input type="time">`
- `category` — `<Select>` (infantil / adultos)
- `instructor` — `<Input>` (optional)
- `display_order` — `<Input type="number">`

On submit: calls `createScheduleAction` or `updateScheduleAction`. Shows toast.

---

## Phase 6: Senseis CRUD

### Files

```
src/app/admin/(shell)/content/senseis/page.tsx
src/components/admin/cms/senseis/senseis-list.tsx
src/components/admin/cms/senseis/sensei-sheet.tsx
src/components/admin/cms/senseis/sensei-form.tsx
```

### `page.tsx`

Fetches all senseis ordered by `display_order`. Passes to `<SenseisList>`.
Shows `<ScheduleSheet>` when `?action` is set.

### `senseis-list.tsx`

`<Table>` columns:

| Photo | Name | Rank | Specialty | Founder | Order | Actions |
| ----- | ---- | ---- | --------- | ------- | ----- | ------- |

- Photo: 40×40 rounded thumbnail using `next/image` (or placeholder avatar icon)
- Founder: `<Badge>` "Fundador" in red if `is_founder`

### `sensei-form.tsx`

**Fields:**

- `name` — `<Input>`
- `rank` — `<Input>`
- `specialty` — `<Input>`
- `bio` — `<Textarea rows={5}>`
- `quote` — `<Textarea rows={2}>`
- `organization` — `<Input>`
- `is_founder` — `<Switch>` + label
- `display_order` — `<Input type="number">`
- `photo_url` — `<ImageUpload bucket="senseis">` (uploads to Supabase, stores URL)

Image upload flow:

```
<ImageUpload
  bucket="senseis"
  value={photoUrl}
  onChange={(url) => setValue("photo_url", url)}
/>
```

---

## Phase 7: Gallery CRUD

### Files

```
src/app/admin/(shell)/content/gallery/page.tsx
src/components/admin/cms/gallery/gallery-admin-grid.tsx
src/components/admin/cms/gallery/gallery-admin-item.tsx
src/components/admin/cms/gallery/gallery-image-sheet.tsx
src/components/admin/cms/gallery/gallery-image-form.tsx
```

### `page.tsx`

Fetches all gallery images ordered by `display_order`. Renders:

- `<CmsPageHeader>` with "New Image" button
- Category filter tabs (client component) using Shadcn `<Tabs>`
- `<GalleryAdminGrid>` with 4-column thumbnail grid

### `gallery-admin-grid.tsx`

Client component. Filtered by active category tab.
Each item: thumbnail + overlay with title, category badge, edit icon, delete icon.
"Edit" sets `?action=edit&id=xxx`. Delete triggers `<DeleteConfirmDialog>`.

### `gallery-image-form.tsx`

**Fields:**

- `title` — `<Input>`
- `category` — `<Select>` (sensei-luciano / belt-ceremonies / kids / dojo)
- `aspect_ratio` — `<Select>` (square / portrait / landscape)
- `display_order` — `<Input type="number">`
- `image_url` — `<ImageUpload bucket="gallery">` (required)

---

## Phase 8: Championships CRUD

### Files

```
src/app/admin/(shell)/content/championships/page.tsx
src/app/admin/(shell)/content/championships/[id]/page.tsx  ← results detail page
src/components/admin/cms/championships/championships-list.tsx
src/components/admin/cms/championships/championship-sheet.tsx
src/components/admin/cms/championships/championship-form.tsx
src/components/admin/cms/championships/results-table.tsx
src/components/admin/cms/championships/result-row-form.tsx
```

### `page.tsx`

Fetches championships (ordered by `event_date` desc). Table columns:

| Name | Date | Location | Status | Gold | Silver | Bronze | Actions |
| ---- | ---- | -------- | ------ | ---- | ------ | ------ | ------- |

- Status: `<Badge>` with colour (green=finalizado, yellow=em-andamento, blue=futuro)
- Actions: Edit (opens Sheet), Results (links to `[id]` page), Delete

### `[id]/page.tsx` — Results Detail Page

Fetches championship by `id` + all `championship_results` for that championship.
Renders:

- Championship name as heading with back link
- `<ResultsTable>` — lists athlete, placement, category with delete per row
- Inline "Add Result" form at bottom of table

### `championship-form.tsx`

**Fields:**

- `name` — `<Input>`
- `event_date` — `<Input type="date">`
- `location` — `<Input>`
- `status` — `<Select>` (finalizado / em-andamento / futuro)
- `gold`, `silver`, `bronze` — `<Input type="number">` (side by side, 3-col grid)
- `display_order` — `<Input type="number">`

### `result-row-form.tsx`

Inline form below the results table. Fields: `athlete_name`, `placement` (Select 1/2/3),
`category` (Input). Submit via `createResultAction`.

---

## Phase 9: Testimonials CRUD

### Files

```
src/app/admin/(shell)/content/testimonials/page.tsx
src/components/admin/cms/testimonials/testimonials-list.tsx
src/components/admin/cms/testimonials/testimonial-sheet.tsx
src/components/admin/cms/testimonials/testimonial-form.tsx
```

### `page.tsx`

Fetches all testimonials. Table columns:

| Author | Role | Quote (truncated 80 chars) | Order | Actions |
| ------ | ---- | -------------------------- | ----- | ------- |

### `testimonial-form.tsx`

**Fields:**

- `author` — `<Input>`
- `role` — `<Input>`
- `quote` — `<Textarea rows={4}>`
- `display_order` — `<Input type="number">`

---

## Phase 10: Plans CRUD

Most complex section. Single page with four `<Tabs>` tabs.

### Files

```
src/app/admin/(shell)/content/plans/page.tsx
src/components/admin/cms/plans/plans-tabs.tsx
src/components/admin/cms/plans/plans-tab.tsx
src/components/admin/cms/plans/plan-sheet.tsx
src/components/admin/cms/plans/plan-form.tsx
src/components/admin/cms/plans/plan-tiers-editor.tsx
src/components/admin/cms/plans/belt-exams-tab.tsx
src/components/admin/cms/plans/belt-exam-row.tsx
src/components/admin/cms/plans/drop-in-tab.tsx
src/components/admin/cms/plans/faq-tab.tsx
src/components/admin/cms/plans/faq-sheet.tsx
```

### `page.tsx`

Fetches all four datasets in parallel:

```ts
const [plans, beltExams, dropIn, faqItems] = await Promise.all([
  supabase.from("plans").select("*").order("display_order"),
  supabase.from("belt_exams").select("*").order("display_order"),
  supabase.from("drop_in_classes").select("*").order("display_order"),
  supabase.from("faq_items").select("*").order("display_order"),
]);
```

Renders `<PlansTabs>` receiving all four datasets.

### Tab 1 — Planos

`<Table>` with columns: Title, plan_key, Recommended badge, Order, Actions.

Plan Sheet form fields:

- `plan_key` — `<Input>` (slugified, e.g. "3x-semana")
- `title` — `<Input>`
- `subtitle` — `<Input>`
- `recommended` — `<Switch>`
- `display_order` — `<Input type="number">`
- `tiers` — `<PlanTiersEditor>` (described below)

### `plan-tiers-editor.tsx`

Client component. Renders a dynamic list of tier rows. Each row:

- `label` — Input (e.g. "Mensal")
- `price` — Input (e.g. "R$ 149")
- `suffix` — Input optional (e.g. "/mês")
- `isMonthlyHighlight` — Switch

Plus "Add tier" button (appends empty row) and "Remove" per row.
Serialises array to JSON string which is set into a hidden `<input name="tiers">`.

### Tab 2 — Exames de Faixa

Inline-edit table. Each row is always in view with editable inputs (no Sheet).
Row fields: `belt`, `price`, `family_price`, `highlighted` (Switch).
"Save" icon button per row calls `updateBeltExamAction`.

### Tab 3 — Aulas Avulsas

Same inline-edit pattern as belt exams.
Row fields: `label`, `price`.

### Tab 4 — FAQ

`<Table>` with Question (truncated), Order, Actions.
FAQ Sheet form: `question` (Input), `answer` (Textarea rows=6), `display_order`.
Full create/edit/delete cycle with `faqActions`.

---

## Phase 11: ISR + Polish

### ISR — revalidatePath calls

Every Server Action already calls `revalidatePath` on the correct public route (see Phase
3 table). Verify they match the actual routes after implementation:

| Action file           | Public page revalidated            |
| --------------------- | ---------------------------------- |
| schedules-actions     | `/horarios`                        |
| senseis-actions       | `/senseis`                         |
| gallery-actions       | `/galeria`                         |
| championships-actions | `/campeonatos`                     |
| testimonials-actions  | `/` (home page shows testimonials) |
| plans-actions         | `/planos`                          |

### Loading States

Add `loading.tsx` files for each sub-section (Next.js Suspense fallback):

```
src/app/admin/(shell)/content/schedules/loading.tsx  → <Skeleton> table rows
src/app/admin/(shell)/content/senseis/loading.tsx
src/app/admin/(shell)/content/gallery/loading.tsx
src/app/admin/(shell)/content/championships/loading.tsx
src/app/admin/(shell)/content/testimonials/loading.tsx
src/app/admin/(shell)/content/plans/loading.tsx
```

Each loading file renders 5 skeleton rows using Shadcn `<Skeleton>`.

### Empty States

Each list component checks for empty data and renders a centered empty state:

- Icon (relevant Lucide icon)
- "Nenhum item encontrado"
- "Criar primeiro" button linking to `?action=new`

### Admin Sidebar Verification

Confirm the "Conteúdo" sidebar link in `admin-sidebar.tsx` points to `/admin/content`
(not a sub-route), so the hub page is the landing.

---

## Phase 12: E2E Tests

**File:** `e2e/admin-cms.spec.ts`

```
describe: Admin CMS

before-each: log in as admin (email + password from env)

test: Hub renders all 6 section cards
  → navigate to /admin/content
  → expect 6 links visible (Horários, Senseis, Galeria, Campeonatos, Depoimentos, Planos)

test: Schedules — list renders seeded data
  → /admin/content/schedules
  → expect at least one row visible (Seg / Qua / Sex)

test: Schedules — create new schedule
  → click "Novo Horário" → Sheet opens
  → fill form (day_group_id=ter-qui, day_label=Ter / Qui, time_start=10:00, time_end=11:00, category=infantil, display_order=99)
  → submit → Sheet closes → new row appears in table
  → navigate to /horarios → verify new time slot visible

test: Schedules — edit existing schedule
  → click Edit on first row → Sheet opens with pre-filled values
  → change instructor name → submit → updated value in table

test: Schedules — delete schedule
  → click Delete on newly created row → confirm dialog appears
  → confirm → row removed from table

test: Senseis — list renders seeded data
  → expect Sensei Luciano visible with Fundador badge

test: Testimonials — create and verify on public home
  → create a testimonial with known author → submit
  → navigate to / → verify author name visible

test: Championships — create event + add result
  → create championship → navigate to results page
  → add a result → verify in results table

test: Plans — FAQ tab — create FAQ item
  → navigate to /admin/content/plans → click FAQ tab
  → add new FAQ → verify question appears in table
  → navigate to /planos → verify question in accordion

test: Gallery — list shows thumbnail grid
  → /admin/content/gallery → expect at least one image thumbnail visible

responsive: Content hub renders correctly at 375px
  → expect section cards stack vertically
```

---

## File Change Summary

### New files (create from scratch)

**Shadcn UI (12 files):**

- `src/components/ui/table.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/sonner.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/tooltip.tsx`

**Validation schemas (6 files):**

- `src/lib/validations/schedule-schema.ts`
- `src/lib/validations/sensei-schema.ts`
- `src/lib/validations/gallery-schema.ts`
- `src/lib/validations/championship-schema.ts`
- `src/lib/validations/testimonial-schema.ts`
- `src/lib/validations/plan-schema.ts`

**Server Actions (6 files):**

- `src/app/admin/actions/schedules-actions.ts`
- `src/app/admin/actions/senseis-actions.ts`
- `src/app/admin/actions/gallery-actions.ts`
- `src/app/admin/actions/championships-actions.ts`
- `src/app/admin/actions/testimonials-actions.ts`
- `src/app/admin/actions/plans-actions.ts`

**Shared CMS components (5 files):**

- `src/components/admin/cms/cms-page-header.tsx`
- `src/components/admin/cms/cms-back-link.tsx`
- `src/components/admin/cms/delete-confirm-dialog.tsx`
- `src/components/admin/cms/image-upload.tsx`
- `src/components/admin/cms/order-controls.tsx`

**Schedules (3 files):**

- `src/components/admin/cms/schedules/schedules-list.tsx`
- `src/components/admin/cms/schedules/schedule-sheet.tsx`
- `src/components/admin/cms/schedules/schedule-form.tsx`

**Senseis (3 files):**

- `src/components/admin/cms/senseis/senseis-list.tsx`
- `src/components/admin/cms/senseis/sensei-sheet.tsx`
- `src/components/admin/cms/senseis/sensei-form.tsx`

**Gallery (4 files):**

- `src/components/admin/cms/gallery/gallery-admin-grid.tsx`
- `src/components/admin/cms/gallery/gallery-admin-item.tsx`
- `src/components/admin/cms/gallery/gallery-image-sheet.tsx`
- `src/components/admin/cms/gallery/gallery-image-form.tsx`

**Championships (5 files):**

- `src/components/admin/cms/championships/championships-list.tsx`
- `src/components/admin/cms/championships/championship-sheet.tsx`
- `src/components/admin/cms/championships/championship-form.tsx`
- `src/components/admin/cms/championships/results-table.tsx`
- `src/components/admin/cms/championships/result-row-form.tsx`

**Testimonials (3 files):**

- `src/components/admin/cms/testimonials/testimonials-list.tsx`
- `src/components/admin/cms/testimonials/testimonial-sheet.tsx`
- `src/components/admin/cms/testimonials/testimonial-form.tsx`

**Plans (11 files):**

- `src/components/admin/cms/plans/plans-tabs.tsx`
- `src/components/admin/cms/plans/plans-tab.tsx`
- `src/components/admin/cms/plans/plan-sheet.tsx`
- `src/components/admin/cms/plans/plan-form.tsx`
- `src/components/admin/cms/plans/plan-tiers-editor.tsx`
- `src/components/admin/cms/plans/belt-exams-tab.tsx`
- `src/components/admin/cms/plans/belt-exam-row.tsx`
- `src/components/admin/cms/plans/drop-in-tab.tsx`
- `src/components/admin/cms/plans/faq-tab.tsx`
- `src/components/admin/cms/plans/faq-sheet.tsx`

**Pages (13 files):**

- `src/app/admin/(shell)/content/page.tsx` (replace stub)
- `src/app/admin/(shell)/content/schedules/page.tsx`
- `src/app/admin/(shell)/content/schedules/loading.tsx`
- `src/app/admin/(shell)/content/senseis/page.tsx`
- `src/app/admin/(shell)/content/senseis/loading.tsx`
- `src/app/admin/(shell)/content/gallery/page.tsx`
- `src/app/admin/(shell)/content/gallery/loading.tsx`
- `src/app/admin/(shell)/content/championships/page.tsx`
- `src/app/admin/(shell)/content/championships/[id]/page.tsx`
- `src/app/admin/(shell)/content/championships/loading.tsx`
- `src/app/admin/(shell)/content/testimonials/page.tsx`
- `src/app/admin/(shell)/content/testimonials/loading.tsx`
- `src/app/admin/(shell)/content/plans/page.tsx`
- `src/app/admin/(shell)/content/plans/loading.tsx`

**E2E test (1 file):**

- `e2e/admin-cms.spec.ts`

### Modified files (edit existing)

- `src/app/admin/(shell)/layout.tsx` — add `<Toaster>` from sonner

---

## Quality Checklist

- Admin creates a new schedule → appears on public `/horarios` (ISR confirmed)
- Admin uploads a gallery image → appears in public `/galeria`
- Admin edits a sensei bio → change reflected on `/senseis`
- Admin adds a championship result → visible on `/campeonatos`
- Admin deletes a testimonial → removed from `/`
- Admin updates a Plan tier price → reflected on `/planos`
- Form validation prevents: empty required fields, invalid time format, invalid email
- Image upload shows progress indicator and error if file too large
- Sheet opens/closes without page reload (URL-driven state)
- Delete confirmation dialog always shown before deletion
- Loading skeletons shown on initial page load for each section
- Empty state shown when no items exist in a section
- `npm run build` passes with zero TypeScript errors
- E2E tests pass: `npx playwright test e2e/admin-cms.spec.ts`
