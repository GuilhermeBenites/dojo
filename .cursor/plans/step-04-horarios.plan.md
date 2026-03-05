---
name: Step 4 — Location and Schedules Page (/horarios)
overview: ""
todos: []
isProject: false
---

# Step 4: Location and Schedules Page

## Goal

Build the `/horarios` page so visitors can find the dojo and check class times.
Reference prototype: `doc/prototype/location.html`.

---

## Sections in the Page (top to bottom)

1. **Page header** — badge + H1 title + subtitle (server, static)
2. **Location + Map row** — 5-col location card on left, 7-col map placeholder on right (server)
3. **Facility badges** — parking and changing-room badges below the location card (server)
4. **Schedule section** — header + Infantil/Adultos filter tabs + day-group grid (filter is client)
5. **CTA banner** — dark gradient call-to-action at the bottom (server)

---

## File Plan

### 1. `src/types/schedule.ts` _(new)_

```ts
export type ScheduleCategory = "Infantil" | "Adultos";

export interface TimeSlot {
  time: string; // e.g. "16:00 - 17:00"
  sensei: string; // e.g. "Sensei Anna Santos"
}

export interface DayGroup {
  id: string; // e.g. "seg-qua-sex"
  label: string; // e.g. "Segunda / Quarta / Sexta"
  category: ScheduleCategory;
  slots: TimeSlot[];
  isPrimary: boolean; // true → red top bar; false → dark top bar
}

export interface Location {
  address: string;
  phone: string;
  email: string;
  mapsHref: string;
}
```

---

### 2. `src/components/horarios/horarios-data.ts` _(new)_

Static data matching the prototype. Exports:

- `LOCATION: Location` — address, phone, email, Google Maps link
- `SCHEDULE_GROUPS: DayGroup[]` — all day groups with both categories

Day groups from prototype:

| Label                    | Category | Slots                                                                                  | isPrimary |
| ------------------------ | -------- | -------------------------------------------------------------------------------------- | --------- |
| Segunda / Quarta / Sexta | Infantil | 16:00–17:00 (Anna), 18:15–19:15 (Luciano)                                              | true      |
| Terça / Quinta           | Infantil | 09:00–10:00 (Wynner), 16:00–17:00 (Anna), 17:00–18:00 (Letícia), 18:15–19:15 (Letícia) | false     |
| Segunda / Quarta / Sexta | Adultos  | 19:30–21:00 (Luciano), 06:30–07:30 (Wynner)                                            | true      |
| Terça / Quinta           | Adultos  | 07:00–08:00 (Letícia), 19:30–21:00 (Luciano)                                           | false     |

_(Adultos data is a plausible addition; the prototype shows only Infantil but the filter implies two categories.)_

---

### 3. `src/components/horarios/location-card.tsx` _(new)_

**Server component** (no `"use client"`).

Props: `location: Location`

Renders:

- H2 "Onde Treinamos" with map-pin icon (use `lucide-react MapPin`)
- Vertical bar + "Endereço" label + full address text
- Vertical bar + "Contato" label + phone + email
- "Como Chegar" anchor button linking to `location.mapsHref` (opens in new tab)

---

### 4. `src/components/horarios/map-placeholder.tsx` _(new)_

**Server component**.

No props.

Renders a styled `<div>` that looks like a map:

- `bg-slate-200 dark:bg-slate-800` background
- Centered bouncing "Estamos aqui!" badge + red map pin SVG
- Zoom +/− decorative buttons (non-functional, aria-hidden)
- `rounded-xl overflow-hidden shadow-lg` container

_(Using a static placeholder avoids Google Maps API requirements until Step 9.)_

---

### 5. `src/components/horarios/schedule-day-card.tsx` _(new)_

**Server / pure presentational component** (no `"use client"`).

Props: `group: DayGroup`

Renders:

- Red or dark top accent bar (`h-2`) based on `group.isPrimary`
- Day label as H3 with `CalendarDays` lucide icon
- List of `TimeSlot` rows: time badge on left, sensei name on right
- Footer note " Chegar com 10 minutos de antecedência."

---

### 6. `src/components/horarios/schedule-filter.tsx` _(new)_

**Client component** (`"use client"`).

Props: `groups: DayGroup[]`

State: `activeCategory: ScheduleCategory` (default `"Infantil"`)

Renders:

- Section header (H2 "Grade de Horários" + subtitle)
- Toggle tabs: `["Infantil", "Adultos"]` — active tab gets white bg + primary text + ring
- Grid of `ScheduleDayCard` components filtered by `activeCategory`
  - `grid-cols-1 lg:grid-cols-2 gap-6`

---

### 7. `src/components/horarios/schedule-cta.tsx` _(new)_

**Server component**.

No props.

Renders the dark gradient CTA banner:

- "Pronto para começar sua jornada?" heading
- Subtitle text
- Primary button "Agendar Aula Grátis" (links to `#` for now)

---

### 8. `src/app/horarios/page.tsx` _(new)_

**Server component** with `metadata` export.

```tsx
export const metadata: Metadata = {
  title: "Localização & Horários | Dojo Luciano dos Santos",
  description: "...",
  openGraph: { ... },
};
```

Layout:

```tsx
<div className="flex flex-col items-center w-full py-10 px-4 md:px-8">
  <div className="w-full max-w-[1200px] space-y-16">
    {/* 1. Page header badge + H1 */}
    {/* 2. Location + Map grid */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <div className="lg:col-span-5 flex flex-col gap-6">
        <LocationCard location={LOCATION} />
        <FacilityBadges />
      </div>
      <div className="lg:col-span-7">
        <MapPlaceholder />
      </div>
    </div>
    <hr />
    {/* 3. Schedule section */}
    <ScheduleFilter groups={SCHEDULE_GROUPS} />
    {/* 4. CTA */}
    <ScheduleCta />
  </div>
</div>
```

> `FacilityBadges` is a tiny inline server component in the page or extracted to its own file — two `div` cards (Parking + Vestiários) in a `grid-cols-2` row.

---

## Tests

### `src/components/horarios/location-card.spec.tsx`

- Renders address text
- Renders phone number
- Renders email
- "Como Chegar" link has correct href (external target `_blank` or `rel`)
- Renders H2 heading

### `src/components/horarios/schedule-day-card.spec.tsx`

- Renders day label as H3
- Renders each time slot's time badge
- Renders each sensei name
- Primary card has red accent class (`bg-primary`)
- Non-primary card does NOT have `bg-primary` accent

### `src/components/horarios/schedule-filter.spec.tsx`

- Default active tab is "Infantil"
- Clicking "Adultos" tab shows only Adultos groups
- Clicking "Infantil" tab back shows only Infantil groups
- Active tab has visual distinction (checks for class or aria)

---

## Playwright E2E Tests

### `tests/horarios.spec.ts` _(new)_

Follows the same pattern as `tests/senseis.spec.ts`. All tests use `test.beforeEach` to navigate to `/horarios`.

#### Page load & metadata

- Page returns HTTP 200
- `<title>` contains "Horários" (or "Localização")

#### Page header

- H1 "Onde Treinamos" / "Horários de Treino" is visible
- Badge "Encontre seu Caminho" is visible

#### Location section

- Address text is visible (e.g. "Rua das Artes Marciais")
- Phone number is visible
- Email is visible
- "Como Chegar" link is present and has an `href`

#### Facility badges

- "Estacionamento" badge is visible
- "Vestiários" badge is visible

#### Schedule section

- H2 "Grade de Horários" is visible
- "Infantil" filter tab is visible and active by default
- "Adultos" filter tab is visible
- At least one schedule day card is visible (e.g. "Segunda / Quarta / Sexta")

#### Category filter interactivity

- Clicking "Adultos" tab shows an Adultos schedule and hides Infantil-only content
- Clicking "Infantil" tab again restores the Infantil schedules

#### CTA banner

- "Pronto para começar sua jornada?" heading is visible
- "Agendar Aula Grátis" button is visible

#### Responsiveness

- Mobile viewport (375px) renders without horizontal overflow
- On mobile, the location card and map stack vertically (map `y` > location card bottom)

#### Accessibility

- Page has a single `<main>` landmark
- Map placeholder has descriptive text (alt or aria-label)

#### SSR verification (JS disabled)

- H1 heading is visible without JavaScript (confirms server rendering)
- Address text is visible without JavaScript (contact info is crawlable)

---

## Quality Checklist (from build plan)

- Category filter toggles correctly between Infantil/Adultos
- Contact info is in plain HTML (crawlable, not hidden behind JS)
- Responsive layout: 320px / 768px / 1280px
- `metadata` exported with title + description + Open Graph
- `npm run build` passes with zero errors
- `npm run test` passes for all new spec files
- Playwright E2E suite passes (`npx playwright test tests/horarios.spec.ts`)

---

## Implementation Order

1. `src/types/schedule.ts`
2. `src/components/horarios/horarios-data.ts`
3. `src/components/horarios/schedule-day-card.tsx`
4. `src/components/horarios/schedule-day-card.spec.tsx`
5. `src/components/horarios/location-card.tsx`
6. `src/components/horarios/location-card.spec.tsx`
7. `src/components/horarios/map-placeholder.tsx`
8. `src/components/horarios/schedule-cta.tsx`
9. `src/components/horarios/schedule-filter.tsx`
10. `src/components/horarios/schedule-filter.spec.tsx`
11. `src/app/horarios/page.tsx`
12. `tests/horarios.spec.ts`
13. Run `npm run build`, `npm run test`, and `npx playwright test tests/horarios.spec.ts` — fix any issues
