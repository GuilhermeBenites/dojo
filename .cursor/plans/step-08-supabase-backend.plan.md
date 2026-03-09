---
name: Step 8 - Supabase Backend and Database Schema
overview: ""
todos: []
isProject: false
---

# Step 8: Supabase Backend and Database Schema

## Goal

Stand up the full data infrastructure so public pages (Step 9) and the admin area (Steps 10–13) can be driven by real data. This step covers: installing the SSR-compatible Supabase client, configuring environment variables, writing and applying the database schema, configuring Row Level Security, creating Storage buckets, and seeding all tables with the same data currently hardcoded in the static `-data.ts` files.

> **The Supabase project has already been created.** Skip project creation; start from environment configuration.

---

## Current Project Conventions to Follow

- **Shared constants:** import from `@/lib/constants` — but Supabase env vars are accessed via `process.env` directly (never imported through constants)
- **Client utilities:** `lib/supabase/server.ts` for Server Components, `lib/supabase/client.ts` for `"use client"` components
- **Types:** Supabase-generated types will live in `src/types/database.ts`
- **SQL files:** stored in `supabase/migrations/` for reference and repeatability; applied via Supabase Dashboard SQL Editor (no CLI required)
- **Seed script:** `supabase/seed.ts` — a standalone TypeScript script run with `tsx` that populates all tables
- **Never commit `.env.local`** — it is already in `.gitignore`

---

## Files to Create or Edit

```
supabase/
  migrations/
    20260309_01_schema.sql        -- all CREATE TABLE + extension statements
    20260309_02_rls.sql           -- all RLS ENABLE + POLICY statements
    20260309_03_storage.sql       -- storage bucket creation + policies
  seed.ts                         -- seed script: inserts prototype data into all tables
src/
  lib/
    supabase/
      client.ts                   -- createBrowserClient for "use client" components
      server.ts                   -- createServerClient for Server Components (uses next/headers cookies)
  types/
    database.ts                   -- hand-written TypeScript types mirroring each table row shape
  app/
    api/
      health/
        route.ts                  -- GET endpoint: pings each table, returns row counts (dev use only)
.env.local                        -- (already gitignored) add NEXT_PUBLIC_SUPABASE_URL + ANON_KEY + SERVICE_ROLE_KEY
```

---

## Environment Variables

Add to `.env.local` (values from Supabase Dashboard → Project Settings → API):

```bash
# Required for all Supabase clients (public — safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>

# Required only for the seed script (never exposed to the browser)
SUPABASE_SERVICE_ROLE_KEY=<service-role-secret-key>
```

**Never** pass `SUPABASE_SERVICE_ROLE_KEY` to the browser client. It bypasses RLS and is only used server-side in the seed script.

---

## Package to Install

`@supabase/ssr` is the officially recommended client for Next.js App Router (handles cookie-based sessions required for auth in Step 10). Install it now to avoid refactoring client utilities later:

```bash
pnpm add @supabase/ssr
```

`@supabase/supabase-js` is already installed (used transitively by `@supabase/ssr` and directly in the seed script).

---

## Supabase Client Utilities

### `src/lib/supabase/server.ts` — Server Component client

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component: cookies cannot be set here.
            // This is expected during static rendering — safe to ignore.
          }
        },
      },
    },
  );
}
```

**Why `async`?** In Next.js 15+, `cookies()` is async. Always `await` it.

**Why the try/catch in `setAll`?** Server Components can read cookies but cannot write them. Supabase SSR calls `setAll` to refresh the session token; the catch prevents crashes in read-only server contexts. The session write happens in middleware (Step 10).

### `src/lib/supabase/client.ts` — Browser client

```ts
"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

Import this only inside `"use client"` components (e.g., the schedule filter, gallery lightbox). For Server Components, always use `createSupabaseServerClient`.

---

## Database Schema

### Migration: `supabase/migrations/20260309_01_schema.sql`

```sql
-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SENSEIS
-- Stores instructor profiles (founder + regular instructors)
-- ============================================================
CREATE TABLE IF NOT EXISTS senseis (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  rank          text        NOT NULL,       -- e.g. "Faixa Preta 5º Dan"
  specialty     text,                        -- e.g. "Kata e Kihon"
  bio           text,                        -- long biography (founder only)
  photo_url     text,                        -- Supabase Storage public URL
  is_founder    boolean     NOT NULL DEFAULT false,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TESTIMONIALS
-- Home-page social proof quotes
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author        text        NOT NULL,
  role          text        NOT NULL,        -- e.g. "Aluno há 3 anos"
  quote         text        NOT NULL,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SCHEDULES
-- Each row = one time slot within a day group
-- ============================================================
CREATE TABLE IF NOT EXISTS schedules (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_group_id   text        NOT NULL,       -- 'seg-qua-sex' | 'ter-qui'
  day_label      text        NOT NULL,       -- 'Segunda, Quarta e Sexta'
  time_start     text        NOT NULL,       -- '07:00'
  time_end       text        NOT NULL,       -- '08:00'
  category       text        NOT NULL CHECK (category IN ('infantil', 'adultos')),
  instructor     text,
  display_order  integer     NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- GALLERY IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  category      text        NOT NULL,        -- 'sensei-luciano' | 'belt-ceremonies' | 'kids' | 'dojo'
  image_url     text        NOT NULL,        -- Supabase Storage public URL
  aspect_ratio  text        NOT NULL DEFAULT 'square', -- 'square' | 'portrait' | 'landscape'
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- CHAMPIONSHIPS
-- One row per championship event
-- ============================================================
CREATE TABLE IF NOT EXISTS championships (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,        -- "Campeonato Paulista de Karate 2024"
  event_date    date        NOT NULL,
  location      text        NOT NULL,
  status        text        NOT NULL CHECK (status IN ('finalizado', 'em-andamento', 'futuro')),
  gold          integer     NOT NULL DEFAULT 0,
  silver        integer     NOT NULL DEFAULT 0,
  bronze        integer     NOT NULL DEFAULT 0,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- CHAMPIONSHIP RESULTS
-- Individual athlete placements within a championship event
-- ============================================================
CREATE TABLE IF NOT EXISTS championship_results (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  championship_id  uuid        NOT NULL REFERENCES championships(id) ON DELETE CASCADE,
  athlete_name     text        NOT NULL,
  placement        integer     NOT NULL CHECK (placement IN (1, 2, 3)),
  category         text        NOT NULL,      -- e.g. "Kata Masculino Senior"
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- HALL OF FAME
-- Featured athletes on the championships page hero
-- ============================================================
CREATE TABLE IF NOT EXISTS hall_of_fame (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  achievement   text        NOT NULL,         -- "5 vezes campeão estadual"
  photo_url     text,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- DOJO STATS
-- Single-row table for global medal counters shown on championships page
-- ============================================================
CREATE TABLE IF NOT EXISTS dojo_stats (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_gold      integer     NOT NULL DEFAULT 0,
  total_silver    integer     NOT NULL DEFAULT 0,
  total_bronze    integer     NOT NULL DEFAULT 0,
  total_trophies  integer     NOT NULL DEFAULT 0,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- PLANS
-- Pricing plans shown on /planos
-- ============================================================
CREATE TABLE IF NOT EXISTS plans (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key      text        NOT NULL UNIQUE,  -- 'tres-vezes' | 'duas-vezes' | 'familia'
  title         text        NOT NULL,
  subtitle      text        NOT NULL,
  recommended   boolean     NOT NULL DEFAULT false,
  tiers         jsonb       NOT NULL DEFAULT '[]'::jsonb,
  -- tiers shape: [{ label, price, isMonthlyHighlight, suffix? }]
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- BELT EXAMS
-- Belt exam pricing shown on /planos
-- ============================================================
CREATE TABLE IF NOT EXISTS belt_exams (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  belt          text        NOT NULL,         -- "Branca até Verde"
  price         text        NOT NULL,         -- "R$ 210,00"
  family_price  text        NOT NULL,         -- "Família: R$ 200,00"
  highlighted   boolean     NOT NULL DEFAULT true,
  display_order integer     NOT NULL DEFAULT 0
);

-- ============================================================
-- DROP-IN CLASSES
-- Aulas avulsas pricing shown on /planos
-- ============================================================
CREATE TABLE IF NOT EXISTS drop_in_classes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label         text        NOT NULL,         -- "Aula Avulsa (Dojo)"
  price         text        NOT NULL,         -- "R$ 60,00"
  display_order integer     NOT NULL DEFAULT 0
);

-- ============================================================
-- FAQ ITEMS
-- Frequently asked questions shown on /planos
-- ============================================================
CREATE TABLE IF NOT EXISTS faq_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question      text        NOT NULL,
  answer        text        NOT NULL,
  display_order integer     NOT NULL DEFAULT 0
);

-- ============================================================
-- STUDENTS  (admin-only — public read NOT granted)
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text        NOT NULL,
  email           text        UNIQUE,
  phone           text,
  belt            text        NOT NULL DEFAULT 'branca',
  plan_id         uuid        REFERENCES plans(id) ON DELETE SET NULL,
  enrollment_date date        NOT NULL DEFAULT CURRENT_DATE,
  birth_date      date,
  active          boolean     NOT NULL DEFAULT true,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- LEADS  (admin-only — public INSERT granted, public read NOT granted)
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  phone      text        NOT NULL,
  source     text        NOT NULL DEFAULT 'website',  -- 'website' | 'whatsapp' | 'referral'
  created_at timestamptz NOT NULL DEFAULT now()
);
```

---

## RLS Policies

### Migration: `supabase/migrations/20260309_02_rls.sql`

```sql
-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE senseis            ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules          ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE championships      ENABLE ROW LEVEL SECURITY;
ALTER TABLE championship_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_of_fame       ENABLE ROW LEVEL SECURITY;
ALTER TABLE dojo_stats         ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans              ENABLE ROW LEVEL SECURITY;
ALTER TABLE belt_exams         ENABLE ROW LEVEL SECURITY;
ALTER TABLE drop_in_classes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE students           ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads              ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PUBLIC READ — showcase content (anon key can SELECT)
-- ============================================================
CREATE POLICY "public_select_senseis"
  ON senseis FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_testimonials"
  ON testimonials FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_schedules"
  ON schedules FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_gallery_images"
  ON gallery_images FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_championships"
  ON championships FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_championship_results"
  ON championship_results FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_hall_of_fame"
  ON hall_of_fame FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_dojo_stats"
  ON dojo_stats FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_plans"
  ON plans FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_belt_exams"
  ON belt_exams FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_drop_in_classes"
  ON drop_in_classes FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_faq_items"
  ON faq_items FOR SELECT TO anon USING (true);

-- ============================================================
-- LEADS — anon INSERT only (no read, no update, no delete)
-- Visitors can submit their info; only admin can read it.
-- ============================================================
CREATE POLICY "public_insert_leads"
  ON leads FOR INSERT TO anon WITH CHECK (true);

-- ============================================================
-- AUTHENTICATED FULL ACCESS — admin manages all content
-- ============================================================
CREATE POLICY "auth_all_senseis"
  ON senseis FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_testimonials"
  ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_schedules"
  ON schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_gallery_images"
  ON gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_championships"
  ON championships FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_championship_results"
  ON championship_results FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_hall_of_fame"
  ON hall_of_fame FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_dojo_stats"
  ON dojo_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_plans"
  ON plans FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_belt_exams"
  ON belt_exams FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_drop_in_classes"
  ON drop_in_classes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_faq_items"
  ON faq_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_students"
  ON students FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_leads"
  ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## Storage Buckets

### Migration: `supabase/migrations/20260309_03_storage.sql`

Run this in the Supabase SQL Editor **after** enabling the Storage extension (it is enabled by default on all projects):

```sql
-- ============================================================
-- BUCKETS
-- ============================================================

-- Sensei and athlete profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'senseis',
  'senseis',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760,  -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- Public read on both buckets (anon can view images)
CREATE POLICY "public_read_senseis"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'senseis');

CREATE POLICY "public_read_gallery"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'gallery');

-- Authenticated write (admin uploads images)
CREATE POLICY "auth_write_senseis"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'senseis');

CREATE POLICY "auth_update_senseis"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'senseis');

CREATE POLICY "auth_delete_senseis"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'senseis');

CREATE POLICY "auth_write_gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "auth_update_gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "auth_delete_gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery');
```

---

## TypeScript Types

### `src/types/database.ts`

Hand-written types mirroring the table row shapes. Step 9 will use these in the service layer. These types exactly match the column definitions above.

```ts
// -------------------------------------------------------
// Row types (SELECT shape returned by Supabase)
// -------------------------------------------------------

export interface SenseiRow {
  id: string;
  name: string;
  rank: string;
  specialty: string | null;
  bio: string | null;
  photo_url: string | null;
  is_founder: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  author: string;
  role: string;
  quote: string;
  display_order: number;
  created_at: string;
}

export interface ScheduleRow {
  id: string;
  day_group_id: string;
  day_label: string;
  time_start: string;
  time_end: string;
  category: "infantil" | "adultos";
  instructor: string | null;
  display_order: number;
  created_at: string;
}

export interface GalleryImageRow {
  id: string;
  title: string;
  category: string;
  image_url: string;
  aspect_ratio: string;
  display_order: number;
  created_at: string;
}

export interface ChampionshipRow {
  id: string;
  name: string;
  event_date: string;
  location: string;
  status: "finalizado" | "em-andamento" | "futuro";
  gold: number;
  silver: number;
  bronze: number;
  display_order: number;
  created_at: string;
}

export interface ChampionshipResultRow {
  id: string;
  championship_id: string;
  athlete_name: string;
  placement: 1 | 2 | 3;
  category: string;
  created_at: string;
}

export interface HallOfFameRow {
  id: string;
  name: string;
  achievement: string;
  photo_url: string | null;
  display_order: number;
  created_at: string;
}

export interface DojoStatsRow {
  id: string;
  total_gold: number;
  total_silver: number;
  total_bronze: number;
  total_trophies: number;
  updated_at: string;
}

export interface PlanRow {
  id: string;
  plan_key: string;
  title: string;
  subtitle: string;
  recommended: boolean;
  tiers: Array<{
    label: string;
    price: string;
    isMonthlyHighlight: boolean;
    suffix?: string;
  }>;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BeltExamRow {
  id: string;
  belt: string;
  price: string;
  family_price: string;
  highlighted: boolean;
  display_order: number;
}

export interface DropInClassRow {
  id: string;
  label: string;
  price: string;
  display_order: number;
}

export interface FaqItemRow {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface StudentRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  belt: string;
  plan_id: string | null;
  enrollment_date: string;
  birth_date: string | null;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  source: string;
  created_at: string;
}

// -------------------------------------------------------
// Insert types (omit generated fields when inserting)
// -------------------------------------------------------

export type SenseiInsert = Omit<SenseiRow, "id" | "created_at" | "updated_at">;
export type ScheduleInsert = Omit<ScheduleRow, "id" | "created_at">;
export type GalleryImageInsert = Omit<GalleryImageRow, "id" | "created_at">;
export type ChampionshipInsert = Omit<ChampionshipRow, "id" | "created_at">;
export type ChampionshipResultInsert = Omit<
  ChampionshipResultRow,
  "id" | "created_at"
>;
export type PlanInsert = Omit<PlanRow, "id" | "created_at" | "updated_at">;

// -------------------------------------------------------
// Database interface (passed as generic to createClient<Database>)
// -------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      senseis: {
        Row: SenseiRow;
        Insert: SenseiInsert;
        Update: Partial<SenseiInsert>;
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: Omit<TestimonialRow, "id" | "created_at">;
        Update: Partial<Omit<TestimonialRow, "id" | "created_at">>;
      };
      schedules: {
        Row: ScheduleRow;
        Insert: ScheduleInsert;
        Update: Partial<ScheduleInsert>;
      };
      gallery_images: {
        Row: GalleryImageRow;
        Insert: GalleryImageInsert;
        Update: Partial<GalleryImageInsert>;
      };
      championships: {
        Row: ChampionshipRow;
        Insert: ChampionshipInsert;
        Update: Partial<ChampionshipInsert>;
      };
      championship_results: {
        Row: ChampionshipResultRow;
        Insert: ChampionshipResultInsert;
        Update: Partial<ChampionshipResultInsert>;
      };
      hall_of_fame: {
        Row: HallOfFameRow;
        Insert: Omit<HallOfFameRow, "id" | "created_at">;
        Update: Partial<Omit<HallOfFameRow, "id" | "created_at">>;
      };
      dojo_stats: {
        Row: DojoStatsRow;
        Insert: Omit<DojoStatsRow, "id">;
        Update: Partial<Omit<DojoStatsRow, "id">>;
      };
      plans: { Row: PlanRow; Insert: PlanInsert; Update: Partial<PlanInsert> };
      belt_exams: {
        Row: BeltExamRow;
        Insert: Omit<BeltExamRow, "id">;
        Update: Partial<Omit<BeltExamRow, "id">>;
      };
      drop_in_classes: {
        Row: DropInClassRow;
        Insert: Omit<DropInClassRow, "id">;
        Update: Partial<Omit<DropInClassRow, "id">>;
      };
      faq_items: {
        Row: FaqItemRow;
        Insert: Omit<FaqItemRow, "id">;
        Update: Partial<Omit<FaqItemRow, "id">>;
      };
      students: {
        Row: StudentRow;
        Insert: Omit<StudentRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<StudentRow, "id" | "created_at" | "updated_at">>;
      };
      leads: {
        Row: LeadRow;
        Insert: Omit<LeadRow, "id" | "created_at">;
        Update: never;
      };
    };
  };
}
```

---

## Seed Script

### `supabase/seed.ts`

This script inserts the same data currently hardcoded in the static `-data.ts` files. Run it once after applying migrations.

**Run command:**

```bash
pnpm exec tsx supabase/seed.ts
```

Install `tsx` if needed: `pnpm add -D tsx`

```ts
import { createClient } from "@supabase/supabase-js";

// Uses the service role key to bypass RLS during seeding
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seed() {
  console.log("🌱 Seeding database...");

  // ---- SENSEIS ----
  await supabase
    .from("senseis")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("senseis").insert([
    {
      name: "Luciano dos Santos",
      rank: "Faixa Preta 5º Dan",
      specialty: "Kata e Kihon",
      bio: "Com mais de 30 anos de experiência no karate, o Sensei Luciano dos Santos é referência no esporte em Mato Grosso do Sul. Fundador do Dojo em 1995, ele formou campeões estaduais, nacionais e internacionais.",
      photo_url: "/images/senseis/luciano.jpg",
      is_founder: true,
      display_order: 0,
    },
    {
      name: "Anna Santos",
      rank: "Faixa Preta 2º Dan",
      specialty: "Kata Feminino",
      bio: null,
      photo_url: "/images/senseis/anna.jpg",
      is_founder: false,
      display_order: 1,
    },
    {
      name: "Wynner Armoa",
      rank: "Faixa Preta 1º Dan",
      specialty: "Kumite e Condicionamento",
      bio: null,
      photo_url: "/images/senseis/wynner.jpg",
      is_founder: false,
      display_order: 2,
    },
    {
      name: "Letícia Mendez",
      rank: "Faixa Preta 1º Dan",
      specialty: "Karate Infantil",
      bio: null,
      photo_url: "/images/senseis/leticia.jpg",
      is_founder: false,
      display_order: 3,
    },
  ]);
  console.log("  ✅ senseis");

  // ---- TESTIMONIALS ----
  await supabase
    .from("testimonials")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("testimonials").insert([
    {
      author: "Carlos Mendes",
      role: "Aluno há 5 anos",
      quote:
        "O Dojo do Sensei Luciano transformou minha vida. Além do karate, aprendi disciplina e respeito que carrego para todos os aspectos da minha vida.",
      display_order: 0,
    },
    {
      author: "Ana Rodrigues",
      role: "Mãe do aluno Pedro",
      quote:
        "Meu filho treina aqui há 3 anos e a evolução é impressionante. Os sensei são excelentes e o ambiente é muito acolhedor para as crianças.",
      display_order: 1,
    },
    {
      author: "Roberto Alves",
      role: "Faixa Preta recente",
      quote:
        "Depois de 8 anos de treino intenso, conquistei minha faixa preta. O suporte do Sensei Luciano foi fundamental em cada etapa da minha jornada.",
      display_order: 2,
    },
  ]);
  console.log("  ✅ testimonials");

  // ---- SCHEDULES ----
  await supabase
    .from("schedules")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("schedules").insert([
    // Adultos — Seg/Qua/Sex
    {
      day_group_id: "seg-qua-sex",
      day_label: "Segunda, Quarta e Sexta",
      time_start: "07:00",
      time_end: "08:00",
      category: "adultos",
      instructor: "Sensei Luciano",
      display_order: 0,
    },
    {
      day_group_id: "seg-qua-sex",
      day_label: "Segunda, Quarta e Sexta",
      time_start: "19:00",
      time_end: "20:30",
      category: "adultos",
      instructor: "Sensei Luciano",
      display_order: 1,
    },
    // Adultos — Ter/Qui
    {
      day_group_id: "ter-qui",
      day_label: "Terça e Quinta",
      time_start: "19:00",
      time_end: "20:30",
      category: "adultos",
      instructor: "Sensei Wynner",
      display_order: 2,
    },
    // Infantil — Seg/Qua/Sex
    {
      day_group_id: "seg-qua-sex",
      day_label: "Segunda, Quarta e Sexta",
      time_start: "17:00",
      time_end: "18:00",
      category: "infantil",
      instructor: "Sensei Letícia",
      display_order: 3,
    },
    {
      day_group_id: "seg-qua-sex",
      day_label: "Segunda, Quarta e Sexta",
      time_start: "18:00",
      time_end: "19:00",
      category: "infantil",
      instructor: "Sensei Anna",
      display_order: 4,
    },
    // Infantil — Ter/Qui
    {
      day_group_id: "ter-qui",
      day_label: "Terça e Quinta",
      time_start: "17:00",
      time_end: "18:00",
      category: "infantil",
      instructor: "Sensei Letícia",
      display_order: 5,
    },
  ]);
  console.log("  ✅ schedules");

  // ---- GALLERY IMAGES ----
  await supabase
    .from("gallery_images")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("gallery_images").insert([
    {
      title: "Treino de Kata",
      category: "sensei-luciano",
      image_url: "/images/gallery/kata-01.jpg",
      aspect_ratio: "portrait",
      display_order: 0,
    },
    {
      title: "Cerimônia de Faixa",
      category: "belt-ceremonies",
      image_url: "/images/gallery/ceremony-01.jpg",
      aspect_ratio: "landscape",
      display_order: 1,
    },
    {
      title: "Aula Infantil",
      category: "kids",
      image_url: "/images/gallery/kids-01.jpg",
      aspect_ratio: "square",
      display_order: 2,
    },
    {
      title: "Interior do Dojo",
      category: "dojo",
      image_url: "/images/gallery/dojo-01.jpg",
      aspect_ratio: "landscape",
      display_order: 3,
    },
    {
      title: "Kumite Avançado",
      category: "sensei-luciano",
      image_url: "/images/gallery/kumite-01.jpg",
      aspect_ratio: "square",
      display_order: 4,
    },
    {
      title: "Graduação 2024",
      category: "belt-ceremonies",
      image_url: "/images/gallery/ceremony-02.jpg",
      aspect_ratio: "portrait",
      display_order: 5,
    },
    {
      title: "Turma Infantil",
      category: "kids",
      image_url: "/images/gallery/kids-02.jpg",
      aspect_ratio: "landscape",
      display_order: 6,
    },
    {
      title: "Equipamentos",
      category: "dojo",
      image_url: "/images/gallery/dojo-02.jpg",
      aspect_ratio: "square",
      display_order: 7,
    },
  ]);
  console.log("  ✅ gallery_images");

  // ---- DOJO STATS ----
  await supabase
    .from("dojo_stats")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("dojo_stats")
    .insert([
      {
        total_gold: 127,
        total_silver: 84,
        total_bronze: 56,
        total_trophies: 15,
      },
    ]);
  console.log("  ✅ dojo_stats");

  // ---- HALL OF FAME ----
  await supabase
    .from("hall_of_fame")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("hall_of_fame").insert([
    {
      name: "Sensei Luciano",
      achievement: "Fundador e 5 vezes campeão estadual",
      photo_url: "/images/senseis/luciano.jpg",
      display_order: 0,
    },
    {
      name: "Ana Silva",
      achievement: "Campeã Brasileira Sub-21 2023",
      photo_url: "/images/athletes/ana.jpg",
      display_order: 1,
    },
    {
      name: "Pedro Santos",
      achievement: "3x Campeão Estadual Kata Masculino",
      photo_url: "/images/athletes/pedro.jpg",
      display_order: 2,
    },
    {
      name: "Julia Costa",
      achievement: "Medalha de Prata — Open Internacional 2023",
      photo_url: "/images/athletes/julia.jpg",
      display_order: 3,
    },
  ]);
  console.log("  ✅ hall_of_fame");

  // ---- CHAMPIONSHIPS ----
  await supabase
    .from("championship_results")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("championships")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  const { data: champs } = await supabase
    .from("championships")
    .insert([
      {
        name: "Campeonato Paulista de Karate 2024",
        event_date: "2024-09-14",
        location: "São Paulo, SP",
        status: "finalizado",
        gold: 3,
        silver: 2,
        bronze: 1,
        display_order: 0,
      },
      {
        name: "Copa Brasil de Clubes 2023",
        event_date: "2023-11-05",
        location: "Curitiba, PR",
        status: "finalizado",
        gold: 2,
        silver: 3,
        bronze: 2,
        display_order: 1,
      },
      {
        name: "Open Internacional 2023",
        event_date: "2023-07-22",
        location: "Campo Grande, MS",
        status: "finalizado",
        gold: 1,
        silver: 2,
        bronze: 0,
        display_order: 2,
      },
    ])
    .select();

  if (champs && champs.length > 0) {
    const [paulista, copaBrasil, open] = champs;
    await supabase.from("championship_results").insert([
      // Paulista 2024
      {
        championship_id: paulista.id,
        athlete_name: "Ana Silva",
        placement: 1,
        category: "Kata Feminino Sub-21",
      },
      {
        championship_id: paulista.id,
        athlete_name: "Pedro Santos",
        placement: 1,
        category: "Kata Masculino Sênior",
      },
      {
        championship_id: paulista.id,
        athlete_name: "Julia Costa",
        placement: 2,
        category: "Kumite Feminino -55kg",
      },
      // Copa Brasil 2023
      {
        championship_id: copaBrasil.id,
        athlete_name: "Pedro Santos",
        placement: 1,
        category: "Kata Masculino Sênior",
      },
      {
        championship_id: copaBrasil.id,
        athlete_name: "Ana Silva",
        placement: 2,
        category: "Kata Feminino Sub-21",
      },
      // Open Internacional 2023
      {
        championship_id: open.id,
        athlete_name: "Julia Costa",
        placement: 2,
        category: "Kumite Feminino -55kg",
      },
    ]);
  }
  console.log("  ✅ championships + championship_results");

  // ---- PLANS ----
  await supabase
    .from("plans")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("plans").insert([
    {
      plan_key: "tres-vezes",
      title: "3x por Semana",
      subtitle: "Treino intenso para máxima evolução",
      recommended: false,
      tiers: [
        { label: "Mês", price: "R$ 300,00", isMonthlyHighlight: true },
        {
          label: "Trimestral",
          price: "R$ 280,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Semestral",
          price: "R$ 270,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Anual",
          price: "R$ 250,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
      ],
      display_order: 0,
    },
    {
      plan_key: "duas-vezes",
      title: "2x por Semana",
      subtitle: "Equilíbrio ideal de rotina",
      recommended: true,
      tiers: [
        { label: "Mês", price: "R$ 280,00", isMonthlyHighlight: true },
        {
          label: "Trimestral",
          price: "R$ 270,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Semestral",
          price: "R$ 250,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Anual",
          price: "R$ 240,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
      ],
      display_order: 1,
    },
    {
      plan_key: "familia",
      title: "Família",
      subtitle: "Treinem juntos com desconto",
      recommended: false,
      tiers: [
        { label: "Mês", price: "R$ 250,00", isMonthlyHighlight: true },
        {
          label: "Trimestral",
          price: "R$ 240,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Semestral",
          price: "R$ 225,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Anual",
          price: "R$ 215,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
      ],
      display_order: 2,
    },
  ]);
  console.log("  ✅ plans");

  // ---- BELT EXAMS ----
  await supabase
    .from("belt_exams")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("belt_exams").insert([
    {
      belt: "Branca até Verde",
      price: "R$ 210,00",
      family_price: "Família: R$ 200,00",
      highlighted: true,
      display_order: 0,
    },
    {
      belt: "Verde para Roxa",
      price: "R$ 250,00",
      family_price: "Família: R$ 230,00",
      highlighted: true,
      display_order: 1,
    },
    {
      belt: "Roxa para Marrom",
      price: "R$ 300,00",
      family_price: "Família: R$ 250,00",
      highlighted: true,
      display_order: 2,
    },
    {
      belt: "Valor da Faixa Simples",
      price: "R$ 45,00",
      family_price: "Família: R$ 40,00",
      highlighted: false,
      display_order: 3,
    },
  ]);
  console.log("  ✅ belt_exams");

  // ---- DROP-IN CLASSES ----
  await supabase
    .from("drop_in_classes")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("drop_in_classes").insert([
    { label: "Aula Avulsa (Dojo)", price: "R$ 60,00", display_order: 0 },
    {
      label: "Alto Rendimento / Competição",
      price: "R$ 30,00",
      display_order: 1,
    },
  ]);
  console.log("  ✅ drop_in_classes");

  // ---- FAQ ITEMS ----
  await supabase
    .from("faq_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("faq_items").insert([
    {
      question: "Preciso comprar o kimono logo no início?",
      answer:
        "Não é obrigatório para as primeiras aulas experimentais. Após o primeiro mês, é necessário ter o kimono para continuar treinando.",
      display_order: 0,
    },
    {
      question: "Como funcionam os exames de faixa?",
      answer:
        "Os exames de faixa ocorrem a cada 3 a 6 meses, dependendo da graduação e do desenvolvimento técnico do aluno. O Sensei avalia o aluno e aprova quando está pronto.",
      display_order: 1,
    },
    {
      question: "Posso trancar o plano em caso de lesão?",
      answer:
        "Sim. Com apresentação de atestado médico, o plano pode ser congelado por até 60 dias sem custo adicional.",
      display_order: 2,
    },
    {
      question: "Quais são as formas de pagamento aceitas?",
      answer:
        "Aceitamos cartão de crédito (recorrência), débito, PIX e dinheiro. Planos trimestrais e anuais podem ser parcelados no cartão de crédito.",
      display_order: 3,
    },
  ]);
  console.log("  ✅ faq_items");

  console.log("🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
```

---

## Health Check API Route

### `src/app/api/health/route.ts`

A lightweight diagnostic endpoint used by the E2E tests to verify database connectivity and row counts. **This route is safe to keep in production** — it only returns counts (no sensitive data) and reads from already-public tables.

```ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const tables = [
      "senseis",
      "testimonials",
      "schedules",
      "gallery_images",
      "championships",
      "hall_of_fame",
      "dojo_stats",
      "plans",
      "belt_exams",
      "drop_in_classes",
      "faq_items",
    ] as const;

    const counts: Record<string, number> = {};

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        return NextResponse.json(
          { status: "error", table, message: error.message },
          { status: 500 },
        );
      }

      counts[table] = count ?? 0;
    }

    return NextResponse.json({ status: "ok", counts });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: String(err) },
      { status: 500 },
    );
  }
}
```

---

## Acceptance Checklist

- `pnpm add @supabase/ssr` installs without errors
- `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- All 3 SQL migration files run in the Supabase Dashboard SQL Editor without errors
- All 11 public tables exist in Supabase Table Editor
- RLS is enabled on all 14 tables (visible in Table Editor → Authentication → RLS)
- Anon user can SELECT from public tables (test: Supabase SQL Editor → `SET ROLE anon; SELECT * FROM senseis;` returns rows)
- Anon user cannot INSERT into `senseis` (test: `SET ROLE anon; INSERT INTO senseis ...` returns RLS error)
- Anon user CAN INSERT into `leads` (test: `SET ROLE anon; INSERT INTO leads (name, phone) VALUES ('Test', '99999');` succeeds)
- Both storage buckets (`senseis`, `gallery`) exist and are marked public
- `pnpm exec tsx supabase/seed.ts` runs without errors and exits with code 0
- After seeding: Supabase Table Editor shows 4 rows in `senseis`, 3 in `testimonials`, 3 in `championships`, 3 in `plans`, etc.
- `GET /api/health` returns `{ status: "ok", counts: { senseis: 4, plans: 3, ... } }`
- `pnpm build` passes with zero TypeScript errors (new types in `database.ts` are valid)

---

## E2E Tests (Playwright)

**File:** `e2e/supabase.spec.ts`

These tests verify the database is seeded and the Supabase client utility works correctly — without testing any UI page (those come in Step 9).

```ts
import { test, expect } from "@playwright/test";

// The dev server must be running (pnpm dev) before executing.
// These tests hit the /api/health endpoint to verify DB connectivity.

test.describe("Supabase database health", () => {
  test("health endpoint returns status ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("senseis table has 4 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.senseis).toBe(4);
  });

  test("testimonials table has 3 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.testimonials).toBe(3);
  });

  test("schedules table has 6 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.schedules).toBe(6);
  });

  test("gallery_images table has 8 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.gallery_images).toBe(8);
  });

  test("championships table has 3 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.championships).toBe(3);
  });

  test("hall_of_fame table has 4 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.hall_of_fame).toBe(4);
  });

  test("dojo_stats table has 1 seeded row", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.dojo_stats).toBe(1);
  });

  test("plans table has 3 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.plans).toBe(3);
  });

  test("belt_exams table has 4 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.belt_exams).toBe(4);
  });

  test("drop_in_classes table has 2 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.drop_in_classes).toBe(2);
  });

  test("faq_items table has 4 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.faq_items).toBe(4);
  });
});
```

---

## Out of Scope for This Step

- Replacing static page data with Supabase queries — that is Step 9 (`services/` layer)
- Authentication or session management — that is Step 10 (Supabase Auth, middleware, admin login)
- Image upload workflow — that is Step 11 (admin CMS with Supabase Storage upload UI)
- Supabase CLI (`supabase init`, `supabase link`) — SQL is applied manually via the Dashboard SQL Editor; CLI setup is optional and can be done later if needed
- Real-time subscriptions — not needed for the static showcase; may be added for admin dashboard in Step 13
- Generated types via `supabase gen types typescript` — the `Database` interface in `src/types/database.ts` is hand-written for now; auto-generation can replace it after Supabase CLI is set up
