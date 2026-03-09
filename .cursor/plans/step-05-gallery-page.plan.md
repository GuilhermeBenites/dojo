---
name: Step 5 - Gallery Page
overview: ""
todos: []
isProject: false
---

# Step 5: Gallery Page

## Goal

Visual social proof -- showcase the dojo's atmosphere through optimized photography with a masonry grid, category filter pills, and a lightbox overlay.

---

## Current Project Conventions to Follow

- **Data files:** co-located with components (`src/components/<feature>/<feature>-data.ts`), not in `src/data/`
- **Types:** declared in `src/types/<domain>.ts`
- **Static data now, Supabase later:** all data lives in a typed data file; Step 9 will swap it for a service call
- **Client Components:** only leaf-level interactive components use `"use client"` -- the page itself must be a Server Component
- **Shared constants:** import from `@/lib/constants` (e.g. `WHATSAPP_URL`)
- **Unit tests:** Vitest + Testing Library, co-located as `<component>.spec.tsx`
- **Styling:** Tailwind v4, brand tokens (`primary`, `background-light`, `background-dark`, `neutral-dark`)
- **Images:** `next/image` with explicit `alt`, `width`/`height` or `fill` + `sizes`

---

## Files to Create

```
src/
  types/
    gallery.ts                             -- GalleryImage and GalleryCategory types
  components/
    galeria/
      galeria-data.ts                      -- static gallery items array
      gallery-filter-bar.tsx               -- "use client" pill filter
      gallery-masonry-grid.tsx             -- "use client" grid + lightbox orchestrator
      gallery-item.tsx                     -- single masonry card (hover overlay, zoom icon)
      gallery-lightbox.tsx                 -- "use client" full-screen dialog overlay
      gallery-cta.tsx                      -- server component CTA banner (reuse pattern from horarios)
      gallery-filter-bar.spec.tsx
      gallery-masonry-grid.spec.tsx
      gallery-item.spec.tsx
      gallery-lightbox.spec.tsx
  app/
    galeria/
      page.tsx                             -- Server Component, exports metadata
```

---

## Types (`src/types/gallery.ts`)

```ts
export type GalleryCategory =
  | "Todos"
  | "Sensei Luciano"
  | "Cerimônias de Faixa"
  | "Aulas Infantis"
  | "Dojo";

export interface GalleryImage {
  id: string;
  src: string; // path under /public or a placeholder URL
  alt: string;
  title: string;
  category: Exclude<GalleryCategory, "Todos">;
  aspectClass: string; // Tailwind aspect-ratio class, e.g. "aspect-[3/4]"
}
```

`aspectClass` lets each card declare its own shape (3/4, 4/3, square, 9/16, 16/9), matching the prototype's varied aspect ratios.

---

## Static Data (`src/components/galeria/galeria-data.ts`)

Declare `GALLERY_CATEGORIES: GalleryCategory[]` and `GALLERY_IMAGES: GalleryImage[]` with 8 items matching the prototype exactly:

| id    | title               | category            | aspectClass   |
| ----- | ------------------- | ------------------- | ------------- |
| gi-01 | Sensei Luciano      | Sensei Luciano      | aspect-[3/4]  |
| gi-02 | Kata em Grupo       | Sensei Luciano      | aspect-[4/3]  |
| gi-03 | Pequenos Guerreiros | Aulas Infantis      | aspect-square |
| gi-04 | Graduação           | Cerimônias de Faixa | aspect-[9/16] |
| gi-05 | Nosso Tatame        | Dojo                | aspect-[16/9] |
| gi-06 | Preparação Mental   | Dojo                | aspect-square |
| gi-07 | Treino de Chute     | Sensei Luciano      | aspect-[3/4]  |
| gi-08 | A Faixa Preta       | Cerimônias de Faixa | aspect-[16/9] |

Use `/images/gallery/placeholder.jpg` as `src` for every item (populated after Step 8 adds Supabase Storage).

---

## Component Breakdown

### `gallery-item.tsx` -- Server-safe presentational card

Props: `image: GalleryImage`, `onOpen: (image: GalleryImage) => void`

```
<div class="masonry-item group relative overflow-hidden rounded-xl ...">
  <div class={image.aspectClass}>
    <Image fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
           src={image.src} alt={image.alt} className="object-cover transition-transform duration-700 group-hover:scale-110" />
  </div>
  <!-- Hover overlay: gradient + category pill + title -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 ...">
    <span class="bg-primary/90 ...uppercase pill">{image.category}</span>
    <h3>{image.title}</h3>
  </div>
  <!-- Zoom button: slides in from top-right on hover -->
  <button aria-label={`Ampliar: ${image.title}`} onClick={() => onOpen(image)} class="absolute right-4 top-4 ...zoom-icon">
    zoom_in (Material Symbol or SVG)
  </button>
</div>
```

This component receives `onOpen` from its parent (`GalleryMasonryGrid`) which controls the lightbox state. Even though it uses `onClick`, the component itself can be a Server Component receiving a handler only if the parent is a Client Component -- since the parent IS a Client Component, the handler can be passed as a prop without marking this file as `"use client"`.

Actually, since `onOpen` is a function prop that must be passed from a client component, and the button `onClick` runs client-side, mark `gallery-item.tsx` as `"use client"` too.

### `gallery-lightbox.tsx` -- `"use client"` fullscreen dialog

Props: `image: GalleryImage | null`, `onClose: () => void`

- Renders `null` when `image` is null
- Uses a `<dialog>` element (or Shadcn `Dialog`) with `role="dialog"` and `aria-modal="true"`
- Closes on: `Escape` keydown (useEffect listener), backdrop click, close button click
- Shows: `next/image` with `fill` and `object-contain`, title, category pill, arrow buttons for prev/next (pass `onPrev`/`onNext` from parent)
- Focus trap: `autoFocus` on close button

```ts
interface GalleryLightboxProps {
  image: GalleryImage | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}
```

### `gallery-masonry-grid.tsx` -- `"use client"` orchestrator

State: `activeCategory: GalleryCategory` (default `"Todos"`), `lightboxIndex: number | null`

- Filters `GALLERY_IMAGES` by `activeCategory` (all pass when `"Todos"`)
- Renders `<GalleryFilterBar>` passing active category and setter
- Renders masonry container and maps `filteredImages` to `<GalleryItem>`
- Renders `<GalleryLightbox>` with current image and prev/next handlers

```
"use client"

export function GalleryMasonryGrid() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("Todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "Todos"
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  const currentImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <GalleryFilterBar active={activeCategory} onChange={setActiveCategory} />
      <div className="masonry-grid"> {/* CSS columns via Tailwind or inline styles */}
        {filtered.map((img, i) => (
          <GalleryItem key={img.id} image={img} onOpen={() => setLightboxIndex(i)} />
        ))}
      </div>
      <GalleryLightbox
        image={currentImage}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(i => i !== null && i > 0 ? i - 1 : i)}
        onNext={() => setLightboxIndex(i => i !== null && i < filtered.length - 1 ? i + 1 : i)}
      />
    </>
  );
}
```

### `gallery-filter-bar.tsx` -- `"use client"` sticky pill bar

Props: `active: GalleryCategory`, `onChange: (cat: GalleryCategory) => void`

Renders all `GALLERY_CATEGORIES` as pill buttons (rounded-full). Active pill: `bg-primary text-white shadow-md`. Inactive: `bg-white ring-1 ring-neutral-200 hover:bg-neutral-light`.

Sticky positioning: `sticky top-[73px] z-40 bg-background-light/95 backdrop-blur-sm` (73px = navbar height).

```tsx
<div role="group" aria-label="Filtrar galeria por categoria">
  {GALLERY_CATEGORIES.map((cat) => (
    <button
      key={cat}
      type="button"
      onClick={() => onChange(cat)}
      aria-pressed={active === cat}
      aria-label={`Mostrar ${cat}`}
      className={active === cat ? "...active styles" : "...inactive styles"}
    >
      {cat}
    </button>
  ))}
</div>
```

### `gallery-cta.tsx` -- Server Component

Identical pattern to `ScheduleCta` -- dark banner with headline, subtitle, and a WhatsApp/schedule CTA button. Import `WHATSAPP_URL` from `@/lib/constants`.

---

## Masonry CSS Strategy

Tailwind v4 does not have a built-in `columns` utility for masonry. Use a global CSS class in `globals.css` (consistent with the prototype's inline `<style>` block):

```css
/* in src/app/globals.css */
.masonry-grid {
  column-count: 1;
  column-gap: 1.5rem;
}
@media (min-width: 640px) {
  .masonry-grid {
    column-count: 2;
  }
}
@media (min-width: 1024px) {
  .masonry-grid {
    column-count: 3;
  }
}
.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}
```

The `aspectClass` on each image div drives the different heights that make the masonry effect work.

---

## Page (`src/app/galeria/page.tsx`)

```tsx
import type { Metadata } from "next";
import { GalleryMasonryGrid } from "@/components/galeria/gallery-masonry-grid";
import { GaleriaCta } from "@/components/galeria/gallery-cta";

export const metadata: Metadata = {
  title: "Galeria | Dojo Luciano dos Santos",
  description:
    "Veja fotos das aulas, cerimônias de faixa, eventos e o ambiente do Dojo Luciano dos Santos. Arte marcial, disciplina e comunidade em Campo Grande - MS.",
  openGraph: {
    title: "Galeria | Dojo Luciano dos Santos",
    description:
      "Fotos das aulas, cerimônias de faixa e eventos do Dojo Luciano dos Santos.",
    type: "website",
  },
};

export default function GaleriaPage() {
  return (
    <div className="flex w-full flex-col items-center py-10 px-4 md:px-8">
      <div className="w-full max-w-[1280px] space-y-0">
        {/* Page header */}
        <section className="relative px-6 pt-16 pb-12 text-center md:pt-24 md:pb-16">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-neutral-dark dark:text-white sm:text-5xl md:text-6xl">
              Nossa Jornada: Dojo Luciano dos Santos
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-dark/70 dark:text-white/70">
              Explore a disciplina, o companheirismo e o espírito que definem
              nosso dojo. Das aulas com Sensei Luciano às cerimônias de faixa.
            </p>
          </div>
        </section>

        {/* Filter + Masonry grid (Client Component) */}
        <GalleryMasonryGrid />

        {/* CTA */}
        <GaleriaCta />
      </div>
    </div>
  );
}
```

The page is a **Server Component** (no `"use client"`). Only `GalleryMasonryGrid` and its children carry client state.

---

## Unit Tests

### `gallery-filter-bar.spec.tsx`

- Default active pill is "Todos" with `aria-pressed="true"`
- Clicking "Sensei Luciano" sets it as active (`aria-pressed="true"`) and removes active from "Todos"
- All 5 category buttons are rendered
- Active pill has visual distinction (className matches `bg-primary` or `text-white`)

### `gallery-masonry-grid.spec.tsx`

- Renders all 8 images by default (no filter)
- After clicking "Aulas Infantis", only items with that category are visible (check alt text)
- After clicking "Todos", all items return
- Clicking an item's zoom button opens the lightbox (lightbox element becomes visible)

### `gallery-item.spec.tsx`

- Renders the image with correct `alt` text
- Renders the title and category pill text
- Calls `onOpen` when the zoom button is clicked

### `gallery-lightbox.spec.tsx`

- Returns null / is not in the DOM when `image` is null
- Renders the image title when `image` is provided
- Calls `onClose` when close button is clicked
- Calls `onClose` when Escape key is pressed (fireEvent.keyDown on document)
- Calls `onPrev`/`onNext` when arrow buttons are clicked

---

## Acceptance Checklist

- `pnpm build` passes with zero errors
- Page is a Server Component (`view-source` shows full HTML with heading and paragraph text)
- Filter pills toggle correctly -- only matching images visible after selection
- Lightbox opens on card click and closes on Escape, backdrop click, and close button
- Lightbox prev/next navigation cycles through filtered images
- All images use `next/image` with `alt`, `fill` + `sizes`
- Masonry layout verified at 320px (1 col), 768px (2 col), 1280px (3 col)
- Filter bar is sticky below the navbar (top-[73px])
- `pnpm test` passes all new spec files
- Page `<title>` and `<meta name="description">` render correctly
- WhatsApp CTA button uses `WHATSAPP_URL` from `@/lib/constants`

---

## E2E Tests (Playwright)

**File:** `e2e/galeria.spec.ts`

The dev server must be running (`pnpm dev`) before executing. Use `page.goto('/galeria')`.

### Test: page renders with correct heading and meta

```ts
test("renders page heading", async ({ page }) => {
  await page.goto("/galeria");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Nossa Jornada",
  );
  await expect(page).toHaveTitle(/Galeria/);
});
```

### Test: all 8 images visible on load (no filter active)

```ts
test("shows all gallery items by default", async ({ page }) => {
  await page.goto("/galeria");
  const items = page.locator(".masonry-item");
  await expect(items).toHaveCount(8);
  // "Todos" pill is active
  const todosBtn = page.getByRole("button", { name: /mostrar todos/i });
  await expect(todosBtn).toHaveAttribute("aria-pressed", "true");
});
```

### Test: category filter hides/shows items

```ts
test("filters to Sensei Luciano category", async ({ page }) => {
  await page.goto("/galeria");
  await page.getByRole("button", { name: /mostrar sensei luciano/i }).click();
  // Only 3 Sensei Luciano items should be visible
  await expect(page.locator(".masonry-item")).toHaveCount(3);
  // "Sensei Luciano" pill is now active
  await expect(
    page.getByRole("button", { name: /mostrar sensei luciano/i }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("returns all items when Todos is clicked again", async ({ page }) => {
  await page.goto("/galeria");
  await page.getByRole("button", { name: /mostrar aulas infantis/i }).click();
  await page.getByRole("button", { name: /mostrar todos/i }).click();
  await expect(page.locator(".masonry-item")).toHaveCount(8);
});
```

### Test: lightbox opens and closes

```ts
test("opens lightbox on card click", async ({ page }) => {
  await page.goto("/galeria");
  // Click the zoom button on the first item
  await page
    .locator(".masonry-item")
    .first()
    .getByRole("button", { name: /ampliar/i })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  // Dialog contains the title of the first image
  await expect(dialog).toContainText("Sensei Luciano");
});

test("closes lightbox with close button", async ({ page }) => {
  await page.goto("/galeria");
  await page
    .locator(".masonry-item")
    .first()
    .getByRole("button", { name: /ampliar/i })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /fechar/i })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("closes lightbox with Escape key", async ({ page }) => {
  await page.goto("/galeria");
  await page
    .locator(".masonry-item")
    .first()
    .getByRole("button", { name: /ampliar/i })
    .click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
```

### Test: lightbox prev/next navigation

```ts
test("navigates to next image in lightbox", async ({ page }) => {
  await page.goto("/galeria");
  await page
    .locator(".masonry-item")
    .first()
    .getByRole("button", { name: /ampliar/i })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Sensei Luciano");
  await dialog.getByRole("button", { name: /próxima/i }).click();
  // Second image title
  await expect(dialog).toContainText("Kata em Grupo");
});
```

### Test: responsive layout -- 1 column on mobile

```ts
test("masonry grid has 1 column on mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/galeria");
  const grid = page.locator(".masonry-grid");
  const columnCount = await grid.evaluate((el) =>
    getComputedStyle(el).getPropertyValue("column-count"),
  );
  expect(columnCount).toBe("1");
});
```

### Test: filter bar is sticky and visible while scrolling

```ts
test("filter bar remains in viewport when scrolled", async ({ page }) => {
  await page.goto("/galeria");
  await page.evaluate(() => window.scrollTo(0, 800));
  const filterBar = page.locator(
    '[aria-label="Filtrar galeria por categoria"]',
  );
  await expect(filterBar).toBeInViewport();
});
```

### Test: CTA button links to WhatsApp

```ts
test("CTA button has correct WhatsApp href", async ({ page }) => {
  await page.goto("/galeria");
  const ctaLink = page.getByRole("link", { name: /agende|whatsapp/i }).last();
  await expect(ctaLink).toHaveAttribute("href", /wa\.me\/5567992879411/);
});
```

---

## Out of Scope for This Step

- Real images (placeholders used; replaced in Step 9 with Supabase Storage URLs)
- Drag-to-reorder (admin feature, Step 11)
- Infinite scroll / "Load more" (Step 11)
- Image upload (Step 8+11)
