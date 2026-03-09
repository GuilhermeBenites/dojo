---
name: Step 6 - Championships Page
overview: ""
todos: []
isProject: false
---

# Step 6: Championships Page

## Goal

Competitive social proof — showcase the dojo's medals, trophies, Hall of Fame athletes, and a chronological timeline of championship results. The page positions the dojo as a high-performance training environment and drives trial-class sign-ups via a primary CTA.

---

## Current Project Conventions to Follow

- **Data files:** co-located with components (`src/components/<feature>/<feature>-data.ts`), not in `src/data/`
- **Types:** declared in `src/types/<domain>.ts`
- **Static data now, Supabase later:** all data lives in a typed data file; a future step will swap it for a service call
- **Client Components:** only leaf-level interactive components use `"use client"` — the page itself must be a Server Component
- **Shared constants:** import from `@/lib/constants` (e.g. `WHATSAPP_URL`)
- **Unit tests:** Vitest + Testing Library, co-located as `<component>.spec.tsx`
- **Styling:** Tailwind v4, brand tokens (`primary`, `background-light`, `background-dark`, `neutral-dark`)
- **Images:** `next/image` with explicit `alt`, `width`/`height` or `fill` + `sizes`

---

## Files to Create

```
src/
  types/
    championships.ts                              -- ChampionshipEvent, MedalResult, HallOfFameAthlete, MedalCounts types
  components/
    campeonatos/
      campeonatos-data.ts                         -- MEDAL_COUNTER_CARDS, HALL_OF_FAME, CHAMPIONSHIPS static arrays
      championships-hero.tsx                      -- server component: dark hero with medal counters
      championships-medal-counter.tsx             -- server component: single medal stat card
      championships-hall-of-fame.tsx              -- server component: 4-card athlete grid
      championships-timeline.tsx                  -- "use client": load-more timeline orchestrator
      championships-event-card.tsx                -- server-safe: single championship event card
      championships-cta.tsx                       -- server component: CTA banner
      championships-hero.spec.tsx
      championships-hall-of-fame.spec.tsx
      championships-timeline.spec.tsx
      championships-event-card.spec.tsx
  app/
    campeonatos/
      page.tsx                                    -- Server Component, exports metadata
e2e/
  campeonatos.spec.ts                             -- Playwright E2E tests
```

---

## Types (`src/types/championships.ts`)

```ts
export type EventStatus = "Finalizado" | string; // year string e.g. "2023"

export interface MedalCounts {
  gold: number;
  silver: number;
  bronze: number;
}

export interface IndividualResult {
  athleteName: string;
  placement: 1 | 2 | 3; // 1 = gold, 2 = silver, 3 = bronze
  category: string; // e.g. "Kumite -75kg", "Kata Individual"
}

export interface ChampionshipEvent {
  id: string;
  title: string;
  date: string; // display string e.g. "15/03/2024"
  location: string; // e.g. "Ginásio do Ibirapuera, São Paulo"
  status: EventStatus;
  medals: MedalCounts;
  results: IndividualResult[];
}

export interface HallOfFameAthlete {
  id: string;
  name: string;
  achievement: string; // e.g. "Campeão Mundial 2022"
  achievementColorClass: string; // Tailwind text color, e.g. "text-yellow-400"
  photoSrc: string;
  photoAlt: string;
}

export interface MedalCounterCard {
  label: string; // "Ouro" | "Prata" | "Bronze" | "Troféus Gerais"
  count: number;
  iconName: string; // Material Symbol name: "military_tech" | "emoji_events"
  iconColorClass: string; // e.g. "text-yellow-400"
  cardVariant: "default" | "primary"; // "primary" = bg-primary card for Troféus
}
```

`achievementColorClass` is a string rather than a union so the data file can pass arbitrary Tailwind classes without requiring a type change when new colors are introduced. `cardVariant` drives whether the Troféus card renders with `bg-primary` background vs the default dark-surface style.

---

## Static Data (`src/components/campeonatos/campeonatos-data.ts`)

### `MEDAL_COUNTER_CARDS: MedalCounterCard[]`

| label          | count | iconName      | iconColorClass  | cardVariant |
| -------------- | ----- | ------------- | --------------- | ----------- |
| Ouro           | 127   | military_tech | text-yellow-400 | default     |
| Prata          | 84    | military_tech | text-slate-300  | default     |
| Bronze         | 56    | military_tech | text-orange-400 | default     |
| Troféus Gerais | 15    | emoji_events  | text-white      | primary     |

### `HALL_OF_FAME: HallOfFameAthlete[]`

| id          | name           | achievement            | achievementColorClass | photoSrc                            | photoAlt                                           |
| ----------- | -------------- | ---------------------- | --------------------- | ----------------------------------- | -------------------------------------------------- |
| hof-luciano | Sensei Luciano | Campeão Mundial 2022   | text-yellow-400       | /images/campeonatos/placeholder.jpg | Sensei Luciano segurando troféu de campeão mundial |
| hof-ana     | Ana Silva      | Campeã Brasileira 2023 | text-primary          | /images/campeonatos/placeholder.jpg | Ana Silva com medalha de ouro do campeonato        |
| hof-pedro   | Pedro Santos   | Ouro Pan-Americano     | text-orange-400       | /images/campeonatos/placeholder.jpg | Pedro Santos em posição de kata                    |
| hof-julia   | Julia Costa    | Tricampeã Estadual     | text-slate-300        | /images/campeonatos/placeholder.jpg | Julia Costa com troféu estadual                    |

Use `/images/campeonatos/placeholder.jpg` as `photoSrc` for every item until real photos are available (Step 9 adds Supabase Storage URLs).

### `CHAMPIONSHIPS: ChampionshipEvent[]`

Array ordered **newest-first** so `slice(0, visibleCount)` always shows the most recent events first.

**Event 1 — Campeonato Paulista de Karate 2024**

```ts
{
  id: "paulista-2024",
  title: "Campeonato Paulista de Karate 2024",
  date: "15/03/2024",
  location: "Ginásio do Ibirapuera, São Paulo",
  status: "Finalizado",
  medals: { gold: 5, silver: 2, bronze: 3 },
  results: [
    { athleteName: "João Oliveira",    placement: 1, category: "Kumite -75kg"    },
    { athleteName: "Mariana Costa",    placement: 1, category: "Kata Individual" },
    { athleteName: "Carlos Mendes",    placement: 2, category: "Kumite +84kg"    },
    { athleteName: "Equipe Masculina", placement: 3, category: "Kata Equipe"     },
  ],
}
```

**Event 2 — Copa Brasil de Clubes**

```ts
{
  id: "copa-brasil-2023",
  title: "Copa Brasil de Clubes",
  date: "10/11/2023",
  location: "Rio de Janeiro, RJ",
  status: "2023",
  medals: { gold: 2, silver: 4, bronze: 1 },
  results: [
    { athleteName: "Sensei Luciano", placement: 1, category: "Master Kata"  },
    { athleteName: "Julia Costa",    placement: 1, category: "Kumite -55kg" },
    { athleteName: "Pedro Santos",   placement: 2, category: "Kumite -67kg" },
  ],
}
```

**Event 3 — Open Internacional**

```ts
{
  id: "open-internacional-2023",
  title: "Open Internacional",
  date: "14/08/2023",
  location: "Curitiba, PR",
  status: "2023",
  medals: { gold: 8, silver: 3, bronze: 5 },
  results: [],
}
```

---

## Component Breakdown

### `championships-hero.tsx` — Server Component

**Props:** none (reads `MEDAL_COUNTER_CARDS` directly from the data file)

**Behavior:**

- Renders a full-width dark section (`bg-background-dark text-white py-16 lg:py-24`)
- Stacks: texture image overlay (absolute, 20% opacity) + gradient overlay + content
- Badge pill, H1, subtitle paragraph, then 2×2 → 4-col medal counter grid

**Key JSX/CSS notes:**

```tsx
<section className="relative bg-background-dark text-white py-16 lg:py-24 overflow-hidden">
  {/* Texture overlay — decorative */}
  <div className="absolute inset-0 opacity-20" aria-hidden="true">
    <Image
      src="/images/texture-dark.jpg"
      alt=""
      fill
      className="object-cover"
    />
  </div>
  {/* Gradient overlay — decorative */}
  <div
    className="absolute inset-0 bg-gradient-to-b from-background-dark/60 to-background-dark/95"
    aria-hidden="true"
  />

  <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
    {/* Badge */}
    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5">
      <span className="text-sm font-bold uppercase tracking-widest text-white">
        Resultados Oficiais
      </span>
    </div>

    {/* Heading */}
    <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
      Nossas Conquistas <span className="text-primary">e Glórias</span>
    </h1>

    {/* Subtitle */}
    <p className="mb-12 max-w-2xl text-lg text-slate-300">
      Celebrando a dedicação, o suor e as vitórias dos nossos atletas nos
      tatames do Brasil e do mundo. Cada medalha conta uma história de
      superação.
    </p>

    {/* Medal counters: 2 cols on mobile, 4 on lg */}
    <div className="grid w-full max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
      {MEDAL_COUNTER_CARDS.map((card) => (
        <ChampionshipsMedalCounter key={card.label} card={card} />
      ))}
    </div>
  </div>
</section>
```

**Accessibility:**

- Texture image: `alt=""` + wrapper `aria-hidden="true"` (decorative)
- Gradient overlay: `aria-hidden="true"`
- H1 uses `text-white` — sufficient contrast on `bg-background-dark`

---

### `championships-medal-counter.tsx` — Server Component

**Props:** `card: MedalCounterCard`

**Behavior:**

- Two visual variants driven by `card.cardVariant`:
  - `"primary"` → `bg-primary` card (Troféus Gerais)
  - `"default"` → `bg-white/10 backdrop-blur-sm` card

**Key JSX/CSS notes:**

```tsx
<div
  className={
    card.cardVariant === "primary"
      ? "flex flex-col items-center rounded-2xl bg-primary p-6 text-center shadow-lg shadow-primary/20"
      : "flex flex-col items-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6 text-center"
  }
>
  <span
    className={`material-symbols-outlined text-4xl mb-2 ${card.iconColorClass}`}
    aria-hidden="true"
  >
    {card.iconName}
  </span>
  <div className="text-4xl font-black text-white">{card.count}</div>
  <div className="mt-1 text-sm uppercase tracking-wide text-slate-300">
    {card.label}
  </div>
</div>
```

**Accessibility:**

- Icon is `aria-hidden="true"` — count and label convey the full meaning

---

### `championships-hall-of-fame.tsx` — Server Component

**Props:** none (reads `HALL_OF_FAME` directly from the data file)

**Behavior:**

- `<section>` with H2 + subtitle + "Ver todos os atletas" link (`hidden md:flex`) + 4-column athlete grid
- Each card: `aspect-[3/4]` photo with gradient overlay, name and achievement label bottom-left
- Hover: image scales (`group-hover:scale-105`)

**Key JSX/CSS notes:**

```tsx
<section className="py-16 lg:py-24 bg-background-light">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mb-10 flex items-end justify-between">
      <div>
        <h2 className="text-3xl font-black text-neutral-dark lg:text-4xl">
          Hall da Fama
        </h2>
        <p className="mt-2 text-neutral-dark/70">
          Nossos atletas de destaque e suas maiores conquistas.
        </p>
      </div>
      <a
        href="#"
        className="hidden items-center gap-1 text-primary font-semibold hover:underline md:flex"
      >
        Ver todos os atletas
        <span
          className="material-symbols-outlined text-base"
          aria-hidden="true"
        >
          arrow_forward
        </span>
      </a>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {HALL_OF_FAME.map((athlete) => (
        <div
          key={athlete.id}
          className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
        >
          <Image
            src={athlete.photoSrc}
            alt={athlete.photoAlt}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 p-5">
            <p className="text-lg font-bold leading-tight text-white">
              {athlete.name}
            </p>
            <p
              className={`mt-1 text-sm font-semibold ${athlete.achievementColorClass}`}
            >
              {athlete.achievement}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Accessibility:**

- Each athlete card image has descriptive `alt`
- Gradient overlay is `aria-hidden="true"`
- Arrow icon on link is `aria-hidden="true"` — link text is sufficient

---

### `championships-timeline.tsx` — `"use client"` orchestrator

**Props:** `events: ChampionshipEvent[]`

**State:** `visibleCount: number` (default: `2`)

**Behavior:**

- Renders `events.slice(0, visibleCount)` mapped to `<ChampionshipsEventCard>`
- Shows "Carregar mais resultados" button only when `visibleCount < events.length`
- Button click: `setVisibleCount((c) => Math.min(c + 1, events.length))`
- Vertical line (`hidden md:block absolute left-8 w-0.5 bg-slate-200`) is decorative and `aria-hidden="true"`

**Key JSX/CSS notes:**

```tsx
"use client";

import { useState } from "react";
import type { ChampionshipEvent } from "@/types/championships";
import { ChampionshipsEventCard } from "./championships-event-card";

interface ChampionshipsTimelineProps {
  events: ChampionshipEvent[];
}

export function ChampionshipsTimeline({ events }: ChampionshipsTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(2);
  const visibleEvents = events.slice(0, visibleCount);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <span className="material-symbols-outlined" aria-hidden="true">
              history
            </span>
          </span>
          <h2 className="text-3xl font-black text-neutral-dark lg:text-4xl">
            Histórico de Campeonatos
          </h2>
        </div>

        <div className="relative pl-8 md:pl-0">
          {/* Decorative vertical line */}
          <div
            className="absolute left-8 top-0 bottom-0 hidden w-0.5 bg-slate-200 md:block"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10">
            {visibleEvents.map((event, index) => (
              <ChampionshipsEventCard
                key={event.id}
                event={event}
                isMostRecent={index === 0}
              />
            ))}
          </div>

          {visibleCount < events.length && (
            <div className="mt-10 flex justify-center md:pl-24">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((c) => Math.min(c + 1, events.length))
                }
                className="flex items-center gap-2 rounded-lg border-2 border-slate-200 px-6 py-3 font-bold text-neutral-dark transition-colors hover:border-primary hover:text-primary"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  expand_more
                </span>
                Carregar mais resultados
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

### `championships-event-card.tsx` — Server-safe presentational component

**Props:** `event: ChampionshipEvent`, `isMostRecent: boolean`

**Behavior:**

- No `"use client"` — receives only serialisable props, no event handlers needed
- Timeline dot: `isMostRecent` → `bg-primary`, else → `bg-slate-400`
- Status badge: `status === "Finalizado"` → `bg-green-100 text-green-700`, else → `bg-slate-200 text-slate-600`
- Medal icon colors per placement: `1` → `text-yellow-400`, `2` → `text-slate-400`, `3` → `text-orange-400`
- Results grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- When `results` is empty, the individual results section is not rendered

**Key JSX/CSS notes:**

```tsx
const placementIconColor = (placement: 1 | 2 | 3) =>
  placement === 1
    ? "text-yellow-400"
    : placement === 2
      ? "text-slate-400"
      : "text-orange-400";

const placementLabel = (placement: 1 | 2 | 3) =>
  placement === 1 ? "1º Lugar" : placement === 2 ? "2º Lugar" : "3º Lugar";

<div className="relative md:pl-24">
  {/* Timeline dot */}
  <div
    className={`absolute left-0 top-6 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white shadow md:flex ${
      isMostRecent ? "bg-primary" : "bg-slate-400"
    }`}
    aria-hidden="true"
  />

  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    {/* Card header */}
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 p-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-xs font-bold ${
              event.status === "Finalizado"
                ? "bg-green-100 text-green-700"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {event.status}
          </span>
          <span className="text-sm font-medium text-neutral-dark/60">
            {event.date}
          </span>
        </div>
        <h3 className="text-xl font-bold text-neutral-dark">{event.title}</h3>
        <p className="mt-1 text-sm text-neutral-dark/60">{event.location}</p>
      </div>
      {/* Medal summary */}
      <div className="flex gap-4">
        <div className="text-center">
          <span className="block text-2xl font-bold text-yellow-500">
            {event.medals.gold}
          </span>
          <span className="text-[10px] font-bold uppercase text-slate-400">
            Ouros
          </span>
        </div>
        <div className="text-center">
          <span className="block text-2xl font-bold text-slate-400">
            {event.medals.silver}
          </span>
          <span className="text-[10px] font-bold uppercase text-slate-400">
            Pratas
          </span>
        </div>
        <div className="text-center">
          <span className="block text-2xl font-bold text-orange-400">
            {event.medals.bronze}
          </span>
          <span className="text-[10px] font-bold uppercase text-slate-400">
            Bronzes
          </span>
        </div>
      </div>
    </div>

    {/* Individual results */}
    {event.results.length > 0 && (
      <div className="p-6">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-dark">
          Resultados Individuais
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {event.results.map((result, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <span
                className={`material-symbols-outlined ${placementIconColor(result.placement)}`}
                aria-hidden="true"
              >
                military_tech
              </span>
              <div>
                <p className="text-sm font-bold text-neutral-dark">
                  {result.athleteName}
                </p>
                <p className="text-xs text-neutral-dark/60">
                  {placementLabel(result.placement)} · {result.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>;
```

**Accessibility:**

- All decorative icons are `aria-hidden="true"`
- Timeline dot is `aria-hidden="true"`
- Each result row has visible text for both athlete name and placement (not icon-only)

---

### `championships-cta.tsx` — Server Component

**Props:** none

**Behavior:**

- Light-red-tinted banner at the bottom of the page (`bg-primary/5`)
- Two links: primary WhatsApp CTA + secondary link to `/senseis`
- Imports `WHATSAPP_URL` from `@/lib/constants` — never hardcoded inline

**Key JSX/CSS notes:**

```tsx
import { WHATSAPP_URL } from "@/lib/constants";

<section className="bg-primary/5 py-16">
  <div className="mx-auto max-w-4xl px-6 text-center">
    <h2 className="mb-4 text-3xl font-black text-neutral-dark lg:text-4xl">
      Quer fazer parte dessas conquistas?
    </h2>
    <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-dark/70">
      Venha treinar com campeões e descubra o seu potencial. A primeira aula é
      por nossa conta.
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
        href="/senseis"
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-8 py-3 font-bold text-neutral-dark transition-colors hover:bg-slate-50"
      >
        Conheça nossa História
      </a>
    </div>
  </div>
</section>;
```

**Accessibility:**

- WhatsApp link: `target="_blank"` + `rel="noopener noreferrer"`
- Both links have visible text with sufficient color contrast

---

## Page (`src/app/campeonatos/page.tsx`)

```tsx
import type { Metadata } from "next";
import { ChampionshipsHero } from "@/components/campeonatos/championships-hero";
import { ChampionshipsHallOfFame } from "@/components/campeonatos/championships-hall-of-fame";
import { ChampionshipsTimeline } from "@/components/campeonatos/championships-timeline";
import { ChampionshipsCta } from "@/components/campeonatos/championships-cta";
import { CHAMPIONSHIPS } from "@/components/campeonatos/campeonatos-data";

export const metadata: Metadata = {
  title: "Campeonatos | Dojo Luciano dos Santos",
  description:
    "Conquistas e resultados oficiais do Dojo Luciano dos Santos em campeonatos de karate. Hall da Fama, medalhas e histórico completo de competições.",
  openGraph: {
    title: "Campeonatos | Dojo Luciano dos Santos",
    description:
      "Conquistas e resultados oficiais do Dojo Luciano dos Santos em campeonatos de karate.",
    type: "website",
  },
};

export default function CampeonatosPage() {
  return (
    <>
      <ChampionshipsHero />
      <ChampionshipsHallOfFame />
      <ChampionshipsTimeline events={CHAMPIONSHIPS} />
      <ChampionshipsCta />
    </>
  );
}
```

The page is a **Server Component** (no `"use client"`). Only `ChampionshipsTimeline` carries client state for load-more; it receives `events` as a serialisable prop from the page.

---

## Unit Tests

### `championships-hero.spec.tsx`

- Renders H1 containing "Nossas Conquistas e Glórias"
- Renders the "Resultados Oficiais" badge text
- Renders exactly 4 medal counter cards (one per `MEDAL_COUNTER_CARDS` entry)
- Renders count "127" for Ouro, "84" for Prata, "56" for Bronze, "15" for Troféus Gerais
- Troféus Gerais card has `bg-primary` class; others do not

### `championships-hall-of-fame.spec.tsx`

- Renders H2 containing "Hall da Fama"
- Renders exactly 4 athlete cards (one per `HALL_OF_FAME` entry)
- Each card renders the athlete's name as visible text
- Each card renders the achievement string as visible text
- "Ver todos os atletas" link is present (`getByRole("link", { name: /ver todos/i })`)
- All 4 athlete images have non-empty `alt` attributes

### `championships-timeline.spec.tsx`

- Renders exactly 2 event cards on initial mount (`visibleCount` = 2)
- "Carregar mais resultados" button is visible when hidden events remain
- Clicking the button reveals the third event card
- After all events are visible, "Carregar mais" button is no longer in the DOM
- "Campeonato Paulista de Karate 2024" and "Copa Brasil de Clubes" are visible initially
- "Open Internacional" is NOT visible initially

### `championships-event-card.spec.tsx`

- Renders the event title
- Renders the date string and location string
- Renders the status badge with correct text ("Finalizado" vs "2023")
- "Finalizado" badge has `bg-green-100` class; "2023" badge has `bg-slate-200` class
- Renders gold, silver, bronze medal counts as numeric text
- Renders individual result rows with athlete name and placement text
- When `results` is empty, no result rows are rendered
- `isMostRecent=true` → timeline dot has `bg-primary`; `isMostRecent=false` → `bg-slate-400`

---

## Acceptance Checklist

- `pnpm build` passes with zero TypeScript errors or warnings
- Page is a Server Component — `view-source` shows full HTML including H1 and section headings
- Hero medal counter grid: 2 columns on mobile (`grid-cols-2`), 4 columns on `lg` (`lg:grid-cols-4`)
- Hall of Fame grid: 1 col mobile, 2 col `sm`, 4 col `lg`
- Timeline renders 2 events on first load; "Carregar mais" button is visible
- Clicking "Carregar mais" reveals the third event; button disappears after all events are shown
- Most recent event (Paulista 2024) timeline dot is `bg-primary`; older events are `bg-slate-400`
- "Finalizado" status badge is green; year-only statuses ("2023") are grey
- Individual result rows render athlete name, placement, and category as visible text
- All images use `next/image` with descriptive `alt`, `fill` + `sizes`
- All decorative icons have `aria-hidden="true"`
- WhatsApp CTA uses `WHATSAPP_URL` imported from `@/lib/constants` — no hardcoded URL
- Secondary CTA links to `/senseis`
- `pnpm test` passes all new spec files with no skipped tests
- Page `<title>` is "Campeonatos | Dojo Luciano dos Santos" and `<meta name="description">` is present
- Lighthouse accessibility score ≥ 90

---

## E2E Tests (Playwright)

**File:** `e2e/campeonatos.spec.ts`

The dev server must be running (`pnpm dev`) before executing. Use `page.goto('/campeonatos')`.

```ts
import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Page render
// ---------------------------------------------------------------------------

test("renders page heading and meta title", async ({ page }) => {
  await page.goto("/campeonatos");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Nossas Conquistas e Glórias",
  );
  await expect(page).toHaveTitle(/Campeonatos/);
});

// ---------------------------------------------------------------------------
// Medal counters
// ---------------------------------------------------------------------------

test("medal counters display correct values", async ({ page }) => {
  await page.goto("/campeonatos");
  const hero = page.locator("section").first();
  await expect(hero).toContainText("127");
  await expect(hero).toContainText("84");
  await expect(hero).toContainText("56");
  await expect(hero).toContainText("15");
  await expect(hero).toContainText("Ouro");
  await expect(hero).toContainText("Prata");
  await expect(hero).toContainText("Bronze");
  await expect(hero).toContainText("Troféus Gerais");
});

// ---------------------------------------------------------------------------
// Hall of Fame
// ---------------------------------------------------------------------------

test("renders all 4 Hall of Fame athletes with names and achievements", async ({
  page,
}) => {
  await page.goto("/campeonatos");
  await expect(page.getByText("Sensei Luciano")).toBeVisible();
  await expect(page.getByText("Ana Silva")).toBeVisible();
  await expect(page.getByText("Pedro Santos")).toBeVisible();
  await expect(page.getByText("Julia Costa")).toBeVisible();
  await expect(page.getByText("Campeão Mundial 2022")).toBeVisible();
  await expect(page.getByText("Campeã Brasileira 2023")).toBeVisible();
  await expect(page.getByText("Ouro Pan-Americano")).toBeVisible();
  await expect(page.getByText("Tricampeã Estadual")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Timeline — default state (2 events visible)
// ---------------------------------------------------------------------------

test("timeline shows first 2 events by default", async ({ page }) => {
  await page.goto("/campeonatos");
  await expect(
    page.getByRole("heading", { name: /campeonato paulista de karate 2024/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /copa brasil de clubes/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /open internacional/i }),
  ).not.toBeVisible();
});

test("load more button is visible on initial load", async ({ page }) => {
  await page.goto("/campeonatos");
  await expect(
    page.getByRole("button", { name: /carregar mais resultados/i }),
  ).toBeVisible();
});

// ---------------------------------------------------------------------------
// Timeline — load more
// ---------------------------------------------------------------------------

test('"Carregar mais" reveals the third event', async ({ page }) => {
  await page.goto("/campeonatos");
  await page.getByRole("button", { name: /carregar mais resultados/i }).click();
  await expect(
    page.getByRole("heading", { name: /open internacional/i }),
  ).toBeVisible();
});

test('"Carregar mais" button disappears after all events are shown', async ({
  page,
}) => {
  await page.goto("/campeonatos");
  await page.getByRole("button", { name: /carregar mais resultados/i }).click();
  await expect(
    page.getByRole("button", { name: /carregar mais resultados/i }),
  ).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------

test("primary CTA links to WhatsApp", async ({ page }) => {
  await page.goto("/campeonatos");
  const ctaLink = page.getByRole("link", {
    name: /agendar aula experimental/i,
  });
  await expect(ctaLink).toHaveAttribute("href", /wa\.me\/5567992879411/);
});

test("secondary CTA links to /senseis", async ({ page }) => {
  await page.goto("/campeonatos");
  const senseiLink = page.getByRole("link", {
    name: /conheça nossa história/i,
  });
  await expect(senseiLink).toHaveAttribute("href", "/senseis");
});

// ---------------------------------------------------------------------------
// Responsive layout
// ---------------------------------------------------------------------------

test("hero medal grid has 2 columns on 375px mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/campeonatos");
  const medalGrid = page.locator("section").first().locator(".grid").first();
  const columns = await medalGrid.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
  );
  expect(columns).toBe(2);
});

test("Hall of Fame grid has 1 column on 375px mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/campeonatos");
  // H2 heading is inside the Hall of Fame section; find the athlete grid sibling
  const hallSection = page
    .getByRole("heading", { name: /hall da fama/i })
    .locator("../../..");
  const athleteGrid = hallSection.locator(".grid").last();
  const columns = await athleteGrid.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
  );
  expect(columns).toBe(1);
});

test("timeline is visible and scrollable on 375px mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/campeonatos");
  await expect(
    page.getByRole("heading", { name: /campeonato paulista de karate 2024/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /carregar mais resultados/i }),
  ).toBeVisible();
});
```

---

## Out of Scope for This Step

- Real athlete photos (placeholders at `/images/campeonatos/placeholder.jpg`; replaced in Step 9 with Supabase Storage URLs)
- Filtering or searching by year, event type, or athlete name
- Individual athlete profile pages
- Live competition scoreboards or real-time data
- Admin panel for adding championship results (Step 11+)
- API-backed pagination (load-more calls Supabase, Step 9+)
