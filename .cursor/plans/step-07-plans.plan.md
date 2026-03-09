---
name: Step 7 - Plans and Pricing Page
overview: ""
todos: []
isProject: false
---

# Step 7: Plans and Pricing Page

## Goal

Remove friction from the conversion funnel by presenting clear, scannable pricing information — monthly/quarterly/semi-annual/annual tiers for 3 plan types, belt exam fees, drop-in prices, payment methods, and a FAQ accordion to handle common objections. A WhatsApp CTA at the bottom captures intent.

---

## Current Project Conventions to Follow

- **Data files:** co-located with components (`src/components/<feature>/<feature>-data.ts`), not in `src/data/`
- **Types:** declared in `src/types/<domain>.ts`
- **Static data now, Supabase later:** all data lives in a typed data file; Step 9 will swap it for a service call
- **Client Components:** only leaf-level interactive components use `"use client"` — the page itself must be a Server Component
- **Shared constants:** import from `@/lib/constants` (e.g. `WHATSAPP_URL`)
- **Unit tests:** Vitest + Testing Library, co-located as `<component>.spec.tsx`
- **Styling:** Tailwind v4, brand tokens (`primary`, `background-light`, `background-dark`, `neutral-dark`)
- **Shadcn/UI components:** already installed — import from `@/components/ui/`

---

## Files to Create

```
src/
  types/
    plans.ts                          -- PricingPlan, PricingTier, BeltExamRow, DropInItem, FaqItem types
  components/
    planos/
      planos-data.ts                  -- PRICING_PLANS, BELT_EXAMS, DROP_IN_CLASSES, FAQ_ITEMS static arrays
      plans-hero.tsx                  -- server: page heading + subtitle
      plans-pricing-card.tsx          -- server: single pricing card (recommended variant)
      plans-pricing-grid.tsx          -- server: 3-col grid of pricing cards
      plans-belt-exam.tsx             -- server: belt exam pricing table
      plans-drop-in.tsx               -- server: drop-in + payment methods stacked cards
      plans-faq.tsx                   -- "use client": Shadcn Accordion FAQ
      plans-cta.tsx                   -- server: WhatsApp CTA banner
      plans-pricing-card.spec.tsx
      plans-belt-exam.spec.tsx
      plans-faq.spec.tsx
  app/
    planos/
      page.tsx                        -- Server Component, exports metadata
e2e/
  planos.spec.ts                      -- Playwright E2E tests
```

---

## Types (`src/types/plans.ts`)

```ts
export interface PricingTier {
  label: string; // "Mês" | "Trimestral" | "Semestral" | "Anual"
  price: string; // e.g. "R$ 300,00"
  isMonthlyHighlight: boolean; // true = rendered large with text-primary; false = normal
  suffix?: string; // "/mês" appended in small text for non-monthly tiers
}

export interface PricingPlan {
  id: string;
  title: string; // "3x por Semana" | "2x por Semana" | "Família"
  subtitle: string;
  tiers: PricingTier[];
  recommended: boolean; // true → border-primary, elevated badge, shadow-lg
}

export interface BeltExamRow {
  id: string;
  belt: string; // e.g. "Branca até Verde"
  price: string; // e.g. "R$ 210,00"
  familyPrice: string; // e.g. "Família: R$ 200,00"
  highlighted: boolean; // true = bg-slate-50 row; false = plain border row (faixa simples)
}

export interface DropInItem {
  id: string;
  label: string; // "Aula Avulsa (Dojo)"
  price: string; // "R$ 60,00"
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
```

`isMonthlyHighlight` keeps the render logic out of the data file — the component decides visual style; the data just signals intent.

---

## Static Data (`src/components/planos/planos-data.ts`)

### `PRICING_PLANS: PricingPlan[]`

**Plan 1 — 3x por Semana**

```ts
{
  id: "tres-vezes",
  title: "3x por Semana",
  subtitle: "Treino intenso para máxima evolução",
  recommended: false,
  tiers: [
    { label: "Mês",        price: "R$ 300,00", isMonthlyHighlight: true  },
    { label: "Trimestral", price: "R$ 280,00", isMonthlyHighlight: false, suffix: "/mês" },
    { label: "Semestral",  price: "R$ 270,00", isMonthlyHighlight: false, suffix: "/mês" },
    { label: "Anual",      price: "R$ 250,00", isMonthlyHighlight: false, suffix: "/mês" },
  ],
}
```

**Plan 2 — 2x por Semana (Recommended)**

```ts
{
  id: "duas-vezes",
  title: "2x por Semana",
  subtitle: "Equilíbrio ideal de rotina",
  recommended: true,
  tiers: [
    { label: "Mês",        price: "R$ 280,00", isMonthlyHighlight: true  },
    { label: "Trimestral", price: "R$ 270,00", isMonthlyHighlight: false, suffix: "/mês" },
    { label: "Semestral",  price: "R$ 250,00", isMonthlyHighlight: false, suffix: "/mês" },
    { label: "Anual",      price: "R$ 240,00", isMonthlyHighlight: false, suffix: "/mês" },
  ],
}
```

**Plan 3 — Família**

```ts
{
  id: "familia",
  title: "Família",
  subtitle: "Treinem juntos com desconto",
  recommended: false,
  tiers: [
    { label: "Mês",        price: "R$ 250,00", isMonthlyHighlight: true  },
    { label: "Trimestral", price: "R$ 240,00", isMonthlyHighlight: false, suffix: "/mês" },
    { label: "Semestral",  price: "R$ 225,00", isMonthlyHighlight: false, suffix: "/mês" },
    { label: "Anual",      price: "R$ 215,00", isMonthlyHighlight: false, suffix: "/mês" },
  ],
}
```

### `BELT_EXAMS: BeltExamRow[]`

| id            | belt                   | price     | familyPrice        | highlighted |
| ------------- | ---------------------- | --------- | ------------------ | ----------- |
| branca-verde  | Branca até Verde       | R$ 210,00 | Família: R$ 200,00 | true        |
| verde-roxa    | Verde para Roxa        | R$ 250,00 | Família: R$ 230,00 | true        |
| roxa-marrom   | Roxa para Marrom       | R$ 300,00 | Família: R$ 250,00 | true        |
| faixa-simples | Valor da Faixa Simples | R$ 45,00  | Família: R$ 40,00  | false       |

### `DROP_IN_CLASSES: DropInItem[]`

| id              | label                        | price    |
| --------------- | ---------------------------- | -------- |
| avulsa-dojo     | Aula Avulsa (Dojo)           | R$ 60,00 |
| alto-rendimento | Alto Rendimento / Competição | R$ 30,00 |

### `FAQ_ITEMS: FaqItem[]`

| id        | question                                  | answer (summary)                                                                                      |
| --------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| kimono    | Preciso comprar o kimono logo no início?  | Not required for first experimental classes. After the first month, a kimono is required.             |
| exames    | Como funcionam os exames de faixa?        | Exams occur every 3–6 months based on grade and technical development. Sensei evaluates and approves. |
| lesao     | Posso trancar o plano em caso de lesão?   | Yes, with a medical certificate, the plan can be frozen for up to 60 days at no extra cost.           |
| pagamento | Quais são as formas de pagamento aceitas? | Credit card (recurrence), debit, PIX, and cash. Quarterly/annual plans can be split on credit card.   |

---

## Component Breakdown

### `plans-hero.tsx` — Server Component

**Props:** none

**Behavior:**

- Clean centered heading section with `bg-background-light py-10`
- H1 "Planos e Valores" + subtitle paragraph
- No image, no dark overlay — this page is content-dense; a lightweight header lets the pricing cards be the visual focus

**Key JSX:**

```tsx
<section className="bg-background-light py-10 text-center">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-dark md:text-4xl">
      Planos e Valores
    </h1>
    <p className="text-lg text-neutral-dark/60">
      Confira nossos planos de fidelidade e valores detalhados.
    </p>
  </div>
</section>
```

---

### `plans-pricing-card.tsx` — Server Component

**Props:** `plan: PricingPlan`

**Behavior:**

- Two visual variants driven by `plan.recommended`:
  - `recommended: true` → `border-2 border-primary shadow-lg md:-translate-y-2 z-10` + "Recomendado" badge
  - `recommended: false` → `border border-slate-200 shadow-sm hover:shadow-md`
- Pricing rows: last tier has no border-b; others have `border-b border-dashed border-slate-200`
- Monthly highlight row: price in `text-primary font-bold text-lg`; all others in `text-neutral-dark font-bold` + small `text-slate-500` suffix

**Key JSX:**

```tsx
<div
  className={
    plan.recommended
      ? "relative flex flex-col gap-4 rounded-xl border-2 border-primary bg-white p-6 shadow-lg md:-translate-y-2 z-10"
      : "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
  }
>
  {plan.recommended && (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
      Recomendado
    </div>
  )}

  {/* Header */}
  <div className="border-b border-slate-100 pb-4 pt-2">
    <h2 className="text-2xl font-bold text-neutral-dark">{plan.title}</h2>
    <p className="text-sm text-neutral-dark/60">{plan.subtitle}</p>
  </div>

  {/* Tiers */}
  <div className="flex flex-col gap-3 flex-1">
    {plan.tiers.map((tier, index) => (
      <div
        key={tier.label}
        className={`flex items-center justify-between py-2 ${
          index < plan.tiers.length - 1
            ? "border-b border-dashed border-slate-200"
            : ""
        }`}
      >
        <span className="font-medium text-neutral-dark/80">{tier.label}</span>
        {tier.isMonthlyHighlight ? (
          <span className="text-lg font-bold text-primary">{tier.price}</span>
        ) : (
          <span className="font-bold text-neutral-dark">
            {tier.price}
            {tier.suffix && (
              <span className="text-xs font-normal text-slate-500">
                {tier.suffix}
              </span>
            )}
          </span>
        )}
      </div>
    ))}
  </div>

  {/* CTA */}
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
  >
    Escolher Plano
  </a>
</div>
```

**Accessibility:**

- "Recomendado" badge is visible text within the card — screen reader reads it in document flow
- CTA is an `<a>` with `target="_blank"` + `rel="noopener noreferrer"`
- Each card's H2 names the plan for landmark purposes

---

### `plans-pricing-grid.tsx` — Server Component

**Props:** none (reads `PRICING_PLANS` directly from the data file)

**Behavior:**

- 3-column grid at `md` breakpoint: `grid-cols-1 md:grid-cols-3`
- `items-stretch` so all cards share the same height baseline
- Passes each plan to `PlansPricingCard`

**Key JSX:**

```tsx
<section className="py-10">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
      {PRICING_PLANS.map((plan) => (
        <PlansPricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  </div>
</section>
```

---

### `plans-belt-exam.tsx` — Server Component

**Props:** none (reads `BELT_EXAMS` directly from the data file)

**Behavior:**

- Card with icon + H3 "Exame de Faixa" header
- `highlighted: true` rows → `bg-slate-50 rounded-lg p-3`
- `highlighted: false` (Faixa Simples) row → `rounded-lg border border-slate-100 p-3`
- Price in `text-primary font-bold`, family price as `text-xs text-slate-500`

**Key JSX:**

```tsx
<div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
  <div className="mb-6 flex items-center gap-3">
    <span
      className="material-symbols-outlined text-3xl text-primary"
      aria-hidden="true"
    >
      military_tech
    </span>
    <h3 className="text-2xl font-bold text-neutral-dark">Exame de Faixa</h3>
  </div>
  <div className="space-y-4">
    {BELT_EXAMS.map((row) => (
      <div
        key={row.id}
        className={`flex flex-col justify-between p-3 sm:flex-row sm:items-center ${
          row.highlighted
            ? "rounded-lg bg-slate-50"
            : "rounded-lg border border-slate-100"
        }`}
      >
        <span className="font-semibold text-neutral-dark">{row.belt}</span>
        <div className="text-right">
          <span className="block font-bold text-primary">{row.price}</span>
          <span className="text-xs text-slate-500">{row.familyPrice}</span>
        </div>
      </div>
    ))}
  </div>
</div>
```

**Accessibility:**

- Icon is `aria-hidden="true"` — H3 label is sufficient
- Price and family price both visible as text

---

### `plans-drop-in.tsx` — Server Component

**Props:** none (reads `DROP_IN_CLASSES` directly from the data file)

**Behavior:**

- Two cards stacked vertically (`flex flex-col gap-6`)
- **Drop-in card:** icon + H3 "Aulas Avulsas" + list of items with `border-b` separator
- **Payment methods card:** dark bg (`bg-slate-900 text-white`), credit card icon, accepted methods text + installment summary chips

**Key JSX:**

```tsx
<div className="flex flex-col gap-6">
  {/* Drop-in classes */}
  <div className="flex-1 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
    <div className="mb-6 flex items-center gap-3">
      <span
        className="material-symbols-outlined text-3xl text-primary"
        aria-hidden="true"
      >
        sports_kabaddi
      </span>
      <h3 className="text-2xl font-bold text-neutral-dark">Aulas Avulsas</h3>
    </div>
    <div className="space-y-4">
      {DROP_IN_CLASSES.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-center justify-between p-4 ${
            index < DROP_IN_CLASSES.length - 1
              ? "border-b border-slate-100"
              : ""
          }`}
        >
          <span className="max-w-[200px] font-medium text-neutral-dark/80">
            {item.label}
          </span>
          <span className="text-xl font-bold text-primary">{item.price}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Payment methods */}
  <div className="rounded-xl bg-slate-900 p-8 text-white shadow-sm">
    <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
      <span
        className="material-symbols-outlined text-primary"
        aria-hidden="true"
      >
        credit_card
      </span>
      Formas de Pagamento
    </h4>
    <p className="mb-4 text-sm text-slate-300">
      Aceitamos cartões de crédito, débito, PIX e dinheiro.
    </p>
    <div className="flex gap-4 font-mono text-xs uppercase tracking-wide text-primary">
      <span>Trimestral: 2x</span>
      <span>Semestral: 3x</span>
      <span>Anual: 6x</span>
    </div>
  </div>
</div>
```

**Accessibility:**

- Both section icons are `aria-hidden="true"` — H3/H4 text conveys heading
- Payment chip text ("Trimestral: 2x") is visible text — not icon-only

---

### `plans-faq.tsx` — `"use client"` Component

**Props:** `items: FaqItem[]`

**Behavior:**

- Uses Shadcn `Accordion` with `type="multiple"` to allow multiple items open simultaneously
- Each `AccordionItem` maps to one FAQ entry
- Chevron rotates 180° when open (Shadcn handles this via `AccordionTrigger` built-in style)
- Max width `max-w-2xl mx-auto` to keep it readable on wide screens

**Key JSX:**

```tsx
"use client";

import type { FaqItem } from "@/types/plans";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PlansFaqProps {
  items: FaqItem[];
}

export function PlansFaq({ items }: PlansFaqProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-neutral-dark">
          Dúvidas Frequentes
        </h2>
        <Accordion type="multiple" className="mx-auto max-w-2xl space-y-4">
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-xl border border-slate-200 bg-white px-6 shadow-sm open:shadow-md"
            >
              <AccordionTrigger className="py-4 text-left text-base font-semibold text-neutral-dark">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-neutral-dark/70">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
```

**Accessibility:**

- Shadcn Accordion uses correct ARIA attributes (`aria-expanded`, `aria-controls`) on the trigger button
- Keyboard navigation: `Tab` to focus, `Enter`/`Space` to toggle, `ArrowDown`/`ArrowUp` to move between items

---

### `plans-cta.tsx` — Server Component

**Props:** none

**Behavior:**

- `bg-primary/5` tinted banner at page bottom (consistent with `/campeonatos` CTA)
- Primary WhatsApp CTA + secondary link to `/horarios` (schedules) — natural next step for a pricing visitor
- `WHATSAPP_URL` imported from `@/lib/constants` — never hardcoded

**Key JSX:**

```tsx
import { WHATSAPP_URL } from "@/lib/constants";

<section className="bg-primary/5 py-16">
  <div className="mx-auto max-w-4xl px-6 text-center">
    <h2 className="mb-4 text-3xl font-black text-neutral-dark lg:text-4xl">
      Pronto para começar?
    </h2>
    <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-dark/70">
      Entre em contato pelo WhatsApp e agende sua aula experimental gratuita.
      Sem compromisso.
    </p>
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/30 transition-colors hover:bg-primary/90"
      >
        Agendar Aula Experimental
      </a>
      <a
        href="/horarios"
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-8 py-3 font-bold text-neutral-dark transition-colors hover:bg-slate-50"
      >
        Ver Horários das Aulas
      </a>
    </div>
  </div>
</section>;
```

---

## Page (`src/app/planos/page.tsx`)

```tsx
import type { Metadata } from "next";
import { PlansHero } from "@/components/planos/plans-hero";
import { PlansPricingGrid } from "@/components/planos/plans-pricing-grid";
import { PlansBeltExam } from "@/components/planos/plans-belt-exam";
import { PlansDropIn } from "@/components/planos/plans-drop-in";
import { PlansFaq } from "@/components/planos/plans-faq";
import { PlansCta } from "@/components/planos/plans-cta";
import { FAQ_ITEMS } from "@/components/planos/planos-data";

export const metadata: Metadata = {
  title: "Planos e Valores | Dojo Luciano dos Santos",
  description:
    "Conheça os planos de karate do Dojo Luciano dos Santos: mensalidades, exames de faixa, aulas avulsas e formas de pagamento. Primeira aula grátis.",
  openGraph: {
    title: "Planos e Valores | Dojo Luciano dos Santos",
    description:
      "Planos mensais, trimestrais e anuais de karate. Exames de faixa e aulas avulsas.",
    type: "website",
  },
};

export default function PlanosPage() {
  return (
    <>
      <PlansHero />
      <div className="bg-background-light">
        <div className="mx-auto max-w-[1100px] px-4 pb-16">
          <PlansPricingGrid />
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <PlansBeltExam />
            <PlansDropIn />
          </div>
        </div>
      </div>
      <PlansFaq items={FAQ_ITEMS} />
      <PlansCta />
    </>
  );
}
```

The page is a **Server Component** (no `"use client"`). Only `PlansFaq` carries client-side accordion state; it receives `FAQ_ITEMS` as a serialisable prop from the page.

---

## Unit Tests

### `plans-pricing-card.spec.tsx`

- Renders the plan title ("3x por Semana")
- Renders the plan subtitle
- Renders all 4 tier labels (Mês, Trimestral, Semestral, Anual)
- Monthly tier price is rendered (R$ 300,00) and non-monthly tiers render a "/mês" suffix
- `recommended: true` renders "Recomendado" badge text in the DOM
- `recommended: false` does NOT render "Recomendado" text
- `recommended: true` card has `border-primary` class on its root element
- `recommended: false` card does NOT have `border-primary` on its root element
- "Escolher Plano" link has `href` matching `WHATSAPP_URL` pattern (`/wame/)
- "Escolher Plano" link has `target="_blank"` and `rel="noopener noreferrer"`

### `plans-belt-exam.spec.tsx`

- Renders H3 containing "Exame de Faixa"
- Renders exactly 4 belt exam rows
- Renders all belt names ("Branca até Verde", "Verde para Roxa", "Roxa para Marrom", "Valor da Faixa Simples")
- Renders all primary prices ("R$ 210,00", "R$ 250,00", "R$ 300,00", "R$ 45,00")
- Renders all family prices ("Família: R$ 200,00", "Família: R$ 230,00", "Família: R$ 250,00", "Família: R$ 40,00")
- `highlighted: true` rows have `bg-slate-50` class
- `highlighted: false` row ("Valor da Faixa Simples") has `border-slate-100` class and no `bg-slate-50`

### `plans-faq.spec.tsx`

- Renders H2 containing "Dúvidas Frequentes"
- Renders all 4 question strings as trigger buttons
- All accordion content is initially hidden (not visible)
- Clicking first question trigger reveals its answer text
- After opening first item, clicking it again hides the answer
- Two items can be open simultaneously (`type="multiple"`)
- Clicking second question does not close the first (multiple mode)
- All trigger buttons are keyboard accessible (`role="button"` or `<button>`)

---

## Acceptance Checklist

- `pnpm build` passes with zero TypeScript errors or warnings
- Page is a Server Component — `view-source` shows full HTML including H1 and pricing tiers
- Pricing grid: 1 column on mobile, 3 columns on `md` breakpoint
- "2x por Semana" card: elevated (`md:-translate-y-2`), red border (`border-primary`), "Recomendado" badge visible
- Monthly tier row (Mês) for each plan renders price with `text-primary` — other tiers render with `/mês` suffix
- Belt exam table: 4 rows; `bg-slate-50` on first 3, plain border on "Faixa Simples"
- Drop-in card renders 2 items with correct prices
- Payment methods dark card is visible with installment info ("Trimestral: 2x", "Semestral: 3x", "Anual: 6x")
- FAQ accordion opens and closes with click; multiple items can be open simultaneously
- FAQ keyboard navigation works (Tab → Enter/Space to toggle)
- All icons have `aria-hidden="true"`; no icon-only meaningful content
- WhatsApp CTA uses `WHATSAPP_URL` from `@/lib/constants` — no hardcoded URL
- Secondary CTA links to `/horarios`
- Page `<title>` is "Planos e Valores | Dojo Luciano dos Santos"
- `<meta name="description">` is present and crawlable
- Responsive layout verified at 375px, 768px, 1280px
- `pnpm test` passes all new spec files with no skipped tests
- Lighthouse accessibility score ≥ 90

---

## E2E Tests (Playwright)

**File:** `e2e/planos.spec.ts`

The dev server must be running (`pnpm dev`) before executing. Use `page.goto('/planos')`.

```ts
import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Page render
// ---------------------------------------------------------------------------

test("renders page heading and meta title", async ({ page }) => {
  await page.goto("/planos");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Planos e Valores",
  );
  await expect(page).toHaveTitle(/Planos e Valores/);
});

// ---------------------------------------------------------------------------
// Pricing cards
// ---------------------------------------------------------------------------

test("renders all 3 pricing plan titles", async ({ page }) => {
  await page.goto("/planos");
  await expect(
    page.getByRole("heading", { name: /3x por semana/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /2x por semana/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /família/i })).toBeVisible();
});

test('"Recomendado" badge is visible only on the 2x plan', async ({ page }) => {
  await page.goto("/planos");
  await expect(page.getByText("Recomendado")).toBeVisible();
  const badges = await page.getByText("Recomendado").count();
  expect(badges).toBe(1);
});

test("all plan cards have a CTA link to WhatsApp", async ({ page }) => {
  await page.goto("/planos");
  const ctaLinks = page.getByRole("link", { name: /escolher plano/i });
  await expect(ctaLinks).toHaveCount(3);
  for (const link of await ctaLinks.all()) {
    await expect(link).toHaveAttribute("href", /wa\.me\/5567992879411/);
  }
});

test("each plan renders 4 pricing tiers including Mês and Anual", async ({
  page,
}) => {
  await page.goto("/planos");
  const mesLabels = await page.getByText("Mês").count();
  const anualLabels = await page.getByText("Anual").count();
  expect(mesLabels).toBeGreaterThanOrEqual(3);
  expect(anualLabels).toBeGreaterThanOrEqual(3);
});

// ---------------------------------------------------------------------------
// Belt exam pricing
// ---------------------------------------------------------------------------

test("renders belt exam section with all 4 rows", async ({ page }) => {
  await page.goto("/planos");
  await expect(
    page.getByRole("heading", { name: /exame de faixa/i }),
  ).toBeVisible();
  await expect(page.getByText("Branca até Verde")).toBeVisible();
  await expect(page.getByText("Verde para Roxa")).toBeVisible();
  await expect(page.getByText("Roxa para Marrom")).toBeVisible();
  await expect(page.getByText("Valor da Faixa Simples")).toBeVisible();
});

test("belt exam rows display correct prices and family prices", async ({
  page,
}) => {
  await page.goto("/planos");
  await expect(page.getByText("R$ 210,00")).toBeVisible();
  await expect(page.getByText("Família: R$ 200,00")).toBeVisible();
  await expect(page.getByText("R$ 45,00")).toBeVisible();
  await expect(page.getByText("Família: R$ 40,00")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Drop-in and payment methods
// ---------------------------------------------------------------------------

test("renders drop-in section with correct prices", async ({ page }) => {
  await page.goto("/planos");
  await expect(
    page.getByRole("heading", { name: /aulas avulsas/i }),
  ).toBeVisible();
  await expect(page.getByText("Aula Avulsa (Dojo)")).toBeVisible();
  await expect(page.getByText("Alto Rendimento / Competição")).toBeVisible();
  await expect(page.getByText("R$ 60,00")).toBeVisible();
  await expect(page.getByText("R$ 30,00")).toBeVisible();
});

test("payment methods card shows installment info", async ({ page }) => {
  await page.goto("/planos");
  await expect(page.getByText("Formas de Pagamento")).toBeVisible();
  await expect(page.getByText(/trimestral: 2x/i)).toBeVisible();
  await expect(page.getByText(/semestral: 3x/i)).toBeVisible();
  await expect(page.getByText(/anual: 6x/i)).toBeVisible();
});

// ---------------------------------------------------------------------------
// FAQ accordion
// ---------------------------------------------------------------------------

test("FAQ section renders all 4 questions", async ({ page }) => {
  await page.goto("/planos");
  await expect(page.getByText("Dúvidas Frequentes")).toBeVisible();
  await expect(page.getByText(/preciso comprar o kimono/i)).toBeVisible();
  await expect(
    page.getByText(/como funcionam os exames de faixa/i),
  ).toBeVisible();
  await expect(page.getByText(/posso trancar o plano/i)).toBeVisible();
  await expect(
    page.getByText(/quais são as formas de pagamento/i),
  ).toBeVisible();
});

test("FAQ answer is hidden by default and visible after click", async ({
  page,
}) => {
  await page.goto("/planos");
  const firstAnswer = page.getByText(
    /não é obrigatório para as primeiras aulas/i,
  );
  await expect(firstAnswer).not.toBeVisible();
  await page.getByText(/preciso comprar o kimono/i).click();
  await expect(firstAnswer).toBeVisible();
});

test("FAQ closes when trigger is clicked again", async ({ page }) => {
  await page.goto("/planos");
  const trigger = page.getByText(/preciso comprar o kimono/i);
  const answer = page.getByText(/não é obrigatório para as primeiras aulas/i);
  await trigger.click();
  await expect(answer).toBeVisible();
  await trigger.click();
  await expect(answer).not.toBeVisible();
});

test("multiple FAQ items can be open simultaneously", async ({ page }) => {
  await page.goto("/planos");
  await page.getByText(/preciso comprar o kimono/i).click();
  await page.getByText(/como funcionam os exames de faixa/i).click();
  await expect(
    page.getByText(/não é obrigatório para as primeiras aulas/i),
  ).toBeVisible();
  await expect(page.getByText(/os exames de faixa ocorrem/i)).toBeVisible();
});

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------

test("primary CTA links to WhatsApp", async ({ page }) => {
  await page.goto("/planos");
  const ctaLink = page.getByRole("link", {
    name: /agendar aula experimental/i,
  });
  await expect(ctaLink).toHaveAttribute("href", /wa\.me\/5567992879411/);
});

test("secondary CTA links to /horarios", async ({ page }) => {
  await page.goto("/planos");
  const horariosLink = page.getByRole("link", {
    name: /ver horários das aulas/i,
  });
  await expect(horariosLink).toHaveAttribute("href", "/horarios");
});

// ---------------------------------------------------------------------------
// Responsive layout
// ---------------------------------------------------------------------------

test("pricing grid is 1 column on 375px mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/planos");
  const grid = page.locator(".grid.grid-cols-1.md\\:grid-cols-3").first();
  const columns = await grid.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
  );
  expect(columns).toBe(1);
});

test("belt exam and drop-in are stacked on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/planos");
  await expect(
    page.getByRole("heading", { name: /exame de faixa/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /aulas avulsas/i }),
  ).toBeVisible();
});

test("pricing grid is 3 columns on 1280px desktop viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/planos");
  const grid = page.locator(".md\\:grid-cols-3").first();
  const columns = await grid.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
  );
  expect(columns).toBe(3);
});
```

---

## Out of Scope for This Step

- Real plan/pricing data pulled from Supabase (replaced in Step 9 — `services/plans.ts`)
- Interactive plan comparison toggle (monthly vs. annual billing switcher)
- Online checkout or payment processing integration
- Admin CRUD for plans and pricing (Step 11+)
- Student enrollment form on this page (lead capture is WhatsApp-first until Step 13)
- Dark mode styling (the prototype has dark mode classes but this project targets light mode only for now)
