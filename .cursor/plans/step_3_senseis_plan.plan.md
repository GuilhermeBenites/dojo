---
name: Step 3 Senseis Page Plan
overview: "Detailed implementation plan for Step 3 of Dojo Digital: build the /senseis page with a Founder Hero Profile section and an Instructors Grid, both fully server-rendered. Includes unit tests (Vitest + React Testing Library) colocated with each component, and an E2E test (Playwright) for the full page."
todos:
  - id: types
    content: Create Sensei TypeScript types in src/types/sensei.ts (Sensei and FounderSensei interfaces)
    status: pending
  - id: static-data
    content: Create static data file src/components/senseis/senseis-data.ts with hardcoded founder + instructors matching the prototype
    status: pending
  - id: founder-hero
    content: Build FounderHero component (src/components/senseis/founder-hero.tsx) — Server Component
    status: pending
  - id: founder-hero-test
    content: Write unit tests for FounderHero (src/components/senseis/founder-hero.spec.tsx)
    status: pending
  - id: instructor-card
    content: Build InstructorCard component (src/components/senseis/instructor-card.tsx) — Server Component
    status: pending
  - id: instructor-card-test
    content: Write unit tests for InstructorCard (src/components/senseis/instructor-card.spec.tsx)
    status: pending
  - id: instructors-grid
    content: Build InstructorsGrid component (src/components/senseis/instructors-grid.tsx) — Server Component
    status: pending
  - id: instructors-grid-test
    content: Write unit tests for InstructorsGrid (src/components/senseis/instructors-grid.spec.tsx)
    status: pending
  - id: page
    content: Create the /senseis route page at src/app/senseis/page.tsx with metadata export
    status: pending
  - id: e2e
    content: Write Playwright E2E test at tests/senseis.spec.ts covering navigation, content, responsiveness
    status: pending
  - id: verify
    content: Run unit tests (pnpm test), E2E tests (pnpm test-e2e), build (pnpm build), lint — all must pass
    status: pending
isProject: false
---

# Step 3: Senseis Page (Authority)

## Current State

Step 1 is complete: folder structure, Shadcn/UI, Tailwind theme, Navbar, Footer, and root layout are in place.

Step 2 is complete: the Home page exists at `src/app/page.tsx` with a Hero section, Benefits grid, and Testimonials section. The `src/components/home/` directory holds section-level components, each with co-located `.spec.tsx` unit tests.

**Test infrastructure already established:**

- Unit tests: `vitest` + `@testing-library/react`, co-located as `*.spec.tsx` next to the component file
- E2E tests: Playwright in `tests/` directory at project root, `baseURL: http://localhost:3000`
- Setup: `src/app/setup.tsx` (Vitest global setup)

**Reference prototype:** `[doc/prototype/sensei.html](doc/prototype/sensei.html)`

---

## Component Map

```
src/
├── types/
│   └── sensei.ts                          ← TypeScript interfaces
├── components/
│   └── senseis/
│       ├── senseis-data.ts                ← Static hardcoded data
│       ├── founder-hero.tsx               ← Founder profile section
│       ├── founder-hero.spec.tsx          ← Unit tests
│       ├── instructor-card.tsx            ← Single instructor card
│       ├── instructor-card.spec.tsx       ← Unit tests
│       ├── instructors-grid.tsx           ← Grid of instructor cards
│       └── instructors-grid.spec.tsx      ← Unit tests
└── app/
    └── senseis/
        └── page.tsx                       ← Route page (Server Component)

tests/
└── senseis.spec.ts                        ← Playwright E2E test
```

---

## 1. TypeScript Types

**File:** `src/types/sensei.ts`

```typescript
export interface Sensei {
  id: string;
  name: string;
  rank: string; // e.g. "3º Dan - Especialista Pedagógica"
  specialty: string; // e.g. "Infantil" (badge label on card)
  bio: string;
  photoUrl: string;
  photoAlt: string;
  profileHref: string; // "#" for now; will link to individual profile page later
}

export interface FounderSensei {
  name: string;
  rank: string; // e.g. "Faixa Preta 5º Dan"
  organization: string; // e.g. "Shotokan Karate International"
  bio: string[]; // Array of paragraphs
  quote: string;
  photoUrl: string;
  photoAlt: string;
}
```

---

## 2. Static Data

**File:** `src/components/senseis/senseis-data.ts`

Hardcoded data matching the prototype exactly, so the page renders correctly with no backend dependency at this stage. Data will be replaced by Supabase queries in Step 9.

```typescript
import type { FounderSensei, Sensei } from "@/types/sensei";

export const FOUNDER: FounderSensei = {
  name: "Sensei Luciano dos Santos",
  rank: "Faixa Preta 5º Dan",
  organization: "Shotokan Karate International",
  bio: [
    "Com mais de 25 anos de dedicação ininterrupta ao Karate Shotokan, o Sensei Luciano acredita que o verdadeiro dojo está dentro de cada um de nós. Sua jornada começou aos 6 anos de idade, e desde então, ele tem transformado vidas através da disciplina marcial.",
    "Sua filosofia de ensino foca não apenas na técnica perfeita, mas no desenvolvimento do caráter. "Disciplina, respeito e superação constante" são os pilares que sustentam cada aula ministrada no dojo.",
  ],
  quote:
    "O Karate não é sobre ser melhor que o outro, é sobre ser melhor do que você era ontem. O verdadeiro oponente está dentro de você.",
  photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFpBzKXfJI...",
  photoAlt: "Sensei Luciano wearing a white karate gi in a focused stance",
};

export const INSTRUCTORS: Sensei[] = [
  {
    id: "anna-santos",
    name: "Sensei Anna Santos",
    rank: "3º Dan - Especialista Pedagógica",
    specialty: "Infantil",
    bio: "Com formação em Educação Física e especialização em desenvolvimento motor infantil, Anna torna o aprendizado do Karate lúdico e disciplinado para crianças.",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIosy...",
    photoAlt: "Portrait of Sensei Anna smiling in a dojo setting",
    profileHref: "#",
  },
  {
    id: "wynner-armoa",
    name: "Sensei Wynner Armoa",
    rank: "4º Dan - Técnico Nacional",
    specialty: "Kata & Técnica",
    bio: "Meticuloso e detalhista, Sensei Wynner foca na perfeição dos movimentos (Kata) e na aplicação técnica (Bunkai), elevando o nível técnico do dojo.",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8nnr...",
    photoAlt: "Sensei Wynner demonstrating a kata technique",
    profileHref: "#",
  },
  {
    id: "leticia-mendez",
    name: "Sensei Letícia Mendez",
    rank: "3º Dan - Ex-Atleta Olímpica",
    specialty: "Alto Rendimento",
    bio: "Responsável pela equipe de competição, Letícia traz sua experiência internacional para preparar atletas de alto rendimento com foco em Kumite.",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqxwi...",
    photoAlt: "Sensei Leticia in a dynamic kumite stance",
    profileHref: "#",
  },
];
```

---

## 3. FounderHero Component

**File:** `src/components/senseis/founder-hero.tsx`

**Type:** Server Component (no `"use client"` — purely presentational)

**Reference:** `[doc/prototype/sensei.html](doc/prototype/sensei.html)` lines 75–133

### Visual Structure

```
<section>                          ← py-16 md:py-24, full-width
  ┌─ Header ──────────────────────────────────────────────────┐
  │  Badge pill: "Mestre & Fundador"                          │
  │  H2: "Sensei Luciano dos Santos"                          │
  │  Red decorative divider (h-1 w-24)                        │
  └───────────────────────────────────────────────────────────┘
  ┌─ Body grid (lg:grid-cols-12) ─────────────────────────────┐
  │  ┌─ Image col (lg:col-span-5, lg:order-last) ────────┐    │
  │  │  Gradient glow (absolute, blur-2xl)               │    │
  │  │  aspect-[4/5] container with overflow-hidden      │    │
  │  │  next/image fill + overlay gradient               │    │
  │  │  Bottom overlay: rank + organization text         │    │
  │  └───────────────────────────────────────────────────┘    │
  │  ┌─ Content col (lg:col-span-7) ─────────────────────┐    │
  │  │  2 <p> bio paragraphs                             │    │
  │  │  <blockquote> with red left-border + quote icon   │    │
  │  │  CTA row: primary button + outlined button        │    │
  │  └───────────────────────────────────────────────────┘    │
  └───────────────────────────────────────────────────────────┘
</section>
```

### Props

```typescript
interface FounderHeroProps {
  founder: FounderSensei;
}
```

### Key Implementation Notes

- Image uses `next/image` with `fill` and `sizes="(max-width: 1024px) 100vw, 42vw"` for responsive optimization
- The image container must be `position: relative` for `fill` to work — use `relative aspect-[4/5]`
- Gradient overlay (`from-black/60`) renders as a `div` layered on top of the image (z-10), the text sits on z-20
- Quote icon: use `lucide-react` `Quote` icon (replaces Material Symbols from prototype)
- CTA buttons are `<a>` tags: "Conheça a História Completa" → `href="#"`, "Fale com o Mestre" → `href="mailto:contato@dojo.com.br"` (placeholder)
- Use `<Mail />` from `lucide-react` next to "Fale com o Mestre"

---

## 4. FounderHero Unit Tests

**File:** `src/components/senseis/founder-hero.spec.tsx`

**Framework:** Vitest + React Testing Library

Mock `next/image` to render a plain `<img>` (same pattern as Home page tests):

```typescript
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));
```

### Test Cases

| #   | Test                                           | Assertion                                                                    |
| --- | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Renders a `<section>` element                  | `container.querySelector("section")` not null                                |
| 2   | Renders the badge "Mestre & Fundador"          | `screen.getByText(/mestre & fundador/i)`                                     |
| 3   | Renders founder name as H2                     | `getByRole("heading", { level: 2, name: /sensei luciano dos santos/i })`     |
| 4   | Renders rank text in image overlay             | `getByText(/faixa preta 5º dan/i)`                                           |
| 5   | Renders organization text                      | `getByText(/shotokan karate international/i)`                                |
| 6   | Renders both bio paragraphs                    | `getByText(/25 anos de dedicação/i)` and `getByText(/filosofia de ensino/i)` |
| 7   | Renders the blockquote with the quote text     | `getByRole("blockquote")` or `getByText(/verdadeiro oponente/i)`             |
| 8   | Renders "— Sensei Luciano" attribution         | `getByText(/— sensei luciano/i)`                                             |
| 9   | Renders "Conheça a História Completa" CTA link | `getByRole("link", { name: /conheça a história completa/i })`                |
| 10  | Renders "Fale com o Mestre" link               | `getByRole("link", { name: /fale com o mestre/i })`                          |
| 11  | Founder image has correct alt text             | `getByRole("img", { name: /sensei luciano wearing a white karate gi/i })`    |

---

## 5. InstructorCard Component

**File:** `src/components/senseis/instructor-card.tsx`

**Type:** Server Component

**Reference:** `[doc/prototype/sensei.html](doc/prototype/sensei.html)` lines 147–168 (one card block)

### Visual Structure

```
<article>                                  ← rounded-xl, border, shadow-soft, hover effects
  ┌─ Image area (aspect-square) ─────────────────┐
  │  next/image fill                             │
  │  Specialty badge (top-right pill)            │
  └──────────────────────────────────────────────┘
  ┌─ Card body (flex-col, p-6) ───────────────────┐
  │  H3: name                                     │
  │  <p>: rank (text-primary)                     │
  │  <p>: bio text                                │
  │  <a> "Ver Perfil" → ArrowRight lucide icon    │
  └──────────────────────────────────────────────┘
</article>
```

### Props

```typescript
interface InstructorCardProps {
  sensei: Sensei;
}
```

### Key Implementation Notes

- Use `<article>` as the semantic wrapper (one instructor = one article)
- `group` class on the article for hover scale effects on the image (`group-hover:scale-110`)
- Specialty badge: absolute positioned, top-right, `rounded-full`, `bg-white/90`, `text-primary`
- "Ver Perfil" uses `<ArrowRight />` from lucide-react (size 16)
- Image: `next/image` with `fill`, `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`

---

## 6. InstructorCard Unit Tests

**File:** `src/components/senseis/instructor-card.spec.tsx`

Same `next/image` mock as above.

Test data — one fixture object:

```typescript
const mockSensei: Sensei = {
  id: "anna-santos",
  name: "Sensei Anna Santos",
  rank: "3º Dan - Especialista Pedagógica",
  specialty: "Infantil",
  bio: "Com formação em Educação Física...",
  photoUrl: "https://example.com/anna.jpg",
  photoAlt: "Portrait of Sensei Anna",
  profileHref: "/senseis/anna-santos",
};
```

### Test Cases

| #   | Test                                        | Assertion                                                                    |
| --- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Renders an `<article>` element              | `container.querySelector("article")` not null                                |
| 2   | Renders sensei name as H3                   | `getByRole("heading", { level: 3, name: "Sensei Anna Santos" })`             |
| 3   | Renders rank text with primary color class  | `getByText("3º Dan - Especialista Pedagógica")` present                      |
| 4   | Renders specialty badge                     | `getByText("Infantil")` present                                              |
| 5   | Renders bio text                            | `getByText(/com formação em educação física/i)`                              |
| 6   | Renders "Ver Perfil" link with correct href | `getByRole("link", { name: /ver perfil/i })` → href = `/senseis/anna-santos` |
| 7   | Image has correct alt text                  | `getByRole("img", { name: "Portrait of Sensei Anna" })`                      |
| 8   | Image src is set correctly                  | img element's `src` attribute matches `mockSensei.photoUrl`                  |

---

## 7. InstructorsGrid Component

**File:** `src/components/senseis/instructors-grid.tsx`

**Type:** Server Component

**Reference:** `[doc/prototype/sensei.html](doc/prototype/sensei.html)` lines 135–217

### Visual Structure

```
<section>                                       ← bg-white py-20
  ┌─ Section header ──────────────────────────┐
  │  H2: "Equipe de Instrutores"              │
  │  <p>: subtitle                            │
  └───────────────────────────────────────────┘
  ┌─ Grid ────────────────────────────────────┐
  │  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3│
  │  {instructors.map(s => <InstructorCard />)}│
  └───────────────────────────────────────────┘
</section>
```

### Props

```typescript
interface InstructorsGridProps {
  instructors: Sensei[];
}
```

---

## 8. InstructorsGrid Unit Tests

**File:** `src/components/senseis/instructors-grid.spec.tsx`

Mocks: `next/image` (same pattern). No need to mock `InstructorCard` — render the full subtree.

Test fixtures: use the full `INSTRUCTORS` array from `senseis-data.ts` (import directly).

### Test Cases

| #   | Test                                    | Assertion                                                                              |
| --- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | Renders a `<section>` element           | `container.querySelector("section")` not null                                          |
| 2   | Renders heading "Equipe de Instrutores" | `getByRole("heading", { level: 2, name: /equipe de instrutores/i })`                   |
| 3   | Renders subtitle paragraph              | `getByText(/nossa equipe é formada por profissionais/i)`                               |
| 4   | Renders exactly 3 instructor cards      | `container.querySelectorAll("article")` length === 3                                   |
| 5   | Renders all 3 instructor names          | `getByRole("heading", { name: /anna santos/i })`, etc.                                 |
| 6   | Renders all 3 specialty badges          | `getByText("Infantil")`, `getByText("Kata & Técnica")`, `getByText("Alto Rendimento")` |
| 7   | Grid has correct column classes         | container grid div has class `lg:grid-cols-3`                                          |

---

## 9. Page Route

**File:** `src/app/senseis/page.tsx`

**Type:** Server Component (no `"use client"`)

### Metadata Export

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossos Senseis | Dojo Luciano dos Santos",
  description:
    "Conheça o Sensei Luciano dos Santos, Faixa Preta 5º Dan, e nossa equipe de instrutores altamente qualificados em Karate Shotokan.",
  openGraph: {
    title: "Nossos Senseis | Dojo Luciano dos Santos",
    description:
      "Conheça o Sensei Luciano dos Santos, Faixa Preta 5º Dan, e nossa equipe de instrutores altamente qualificados em Karate Shotokan.",
    type: "website",
  },
};
```

### Page Body

```typescript
import { FounderHero } from "@/components/senseis/founder-hero";
import { InstructorsGrid } from "@/components/senseis/instructors-grid";
import { FOUNDER, INSTRUCTORS } from "@/components/senseis/senseis-data";

export default function SenseisPage() {
  return (
    <main>
      <FounderHero founder={FOUNDER} />
      <InstructorsGrid instructors={INSTRUCTORS} />
    </main>
  );
}
```

> Note: No tests are written for `page.tsx` itself — its composition is verified by the E2E test. The component-level logic is covered by unit tests on `FounderHero` and `InstructorsGrid`.

---

## 10. Playwright E2E Test

**File:** `tests/senseis.spec.ts`

**Config:** Uses existing `playwright.config.ts` — `baseURL: http://localhost:3000`, runs against the live dev server.

### Test Suite Outline

```typescript
import { test, expect } from "@playwright/test";

test.describe("Senseis page (/senseis)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/senseis");
  });

  // --- Page load & metadata ---
  test("page title contains 'Senseis'", async ({ page }) => { ... });
  test("page returns HTTP 200", async ({ page }) => { ... });

  // --- Founder Hero section ---
  test("renders Founder heading", async ({ page }) => { ... });
  test("renders founder badge 'Mestre & Fundador'", async ({ page }) => { ... });
  test("renders founder bio text", async ({ page }) => { ... });
  test("renders founder blockquote", async ({ page }) => { ... });
  test("renders 'Conheça a História Completa' CTA button", async ({ page }) => { ... });

  // --- Instructors Grid ---
  test("renders 'Equipe de Instrutores' heading", async ({ page }) => { ... });
  test("renders 3 instructor cards", async ({ page }) => { ... });
  test("each instructor card has a 'Ver Perfil' link", async ({ page }) => { ... });
  test("renders specialty badges on instructor cards", async ({ page }) => { ... });

  // --- Navigation ---
  test("navbar /senseis link is visually active/highlighted", async ({ page }) => { ... });
  test("can navigate to /senseis from home page via navbar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Senseis" }).first().click();
    await expect(page).toHaveURL("/senseis");
  });

  // --- Responsiveness ---
  test("mobile viewport renders without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/senseis");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test("instructor grid stacks to 1 column on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const grid = page.locator("section").filter({ hasText: "Equipe de Instrutores" }).locator(">div>div");
    // On mobile the grid has 1 column — cards stack vertically
    const firstCard = grid.locator("article").first();
    const secondCard = grid.locator("article").nth(1);
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    // Second card should be below the first (y > first.y + first.height)
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y + firstBox!.height - 10);
  });

  // --- Accessibility ---
  test("page has a single <main> landmark", async ({ page }) => {
    const mainCount = await page.locator("main").count();
    expect(mainCount).toBe(1);
  });

  test("founder image has non-empty alt text", async ({ page }) => {
    const founderImg = page.locator("section").first().locator("img").first();
    const alt = await founderImg.getAttribute("alt");
    expect(alt).toBeTruthy();
  });

  test("instructor images all have non-empty alt text", async ({ page }) => {
    const cards = page.locator("article");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const alt = await cards.nth(i).locator("img").getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });

  // --- SSR verification ---
  test("founder heading is present in SSR HTML (no JS required)", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/senseis");
    const heading = page.getByRole("heading", { name: /sensei luciano dos santos/i });
    await expect(heading).toBeVisible();
    await context.close();
  });
});
```

---

## 11. Verification Phase

Run all checks in order:

### 11.1 Unit Tests

```bash
pnpm test --run
```

Expected: All tests in `src/components/senseis/` pass. Zero failures.

Covered:

- `founder-hero.spec.tsx` — 11 tests
- `instructor-card.spec.tsx` — 8 tests
- `instructors-grid.spec.tsx` — 7 tests

### 11.2 Build Verification

```bash
pnpm build
```

Expected: Zero TypeScript errors, zero build errors. The `/senseis` route is listed in the output.

### 11.3 Lint

```bash
pnpm lint
```

Expected: Zero errors or warnings related to new files.

### 11.4 Type Check

```bash
npx tsc --noEmit
```

Expected: Zero errors.

### 11.5 E2E Tests

```bash
pnpm test-e2e --project=chromium tests/senseis.spec.ts
```

Expected: All tests pass against the live dev server on `http://localhost:3000`.

Optionally, run against Mobile Chrome for responsiveness:

```bash
pnpm test-e2e --project="Mobile Chrome" tests/senseis.spec.ts
```

---

## Quality Checklist (from Build Plan)

| Check             | Criterion                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------- |
| SSR               | Page is fully server-rendered — `view-source` shows complete HTML including instructor names |
| Responsiveness    | Layout verified at 375px, 768px, 1280px                                                      |
| Metadata          | `metadata` export includes `title`, `description`, and `openGraph`                           |
| Images            | All images use `next/image` with `alt`, `fill`, and `sizes`                                  |
| Semantic HTML     | Uses `<section>`, `<article>`, `<blockquote>`, heading hierarchy h1→h2→h3                    |
| No `"use client"` | Neither `page.tsx` nor any sensei component uses client-side state                           |
| Accessible        | All images have alt text; interactive links are keyboard-focusable                           |
