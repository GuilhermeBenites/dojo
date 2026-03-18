---
name: Step 9 - Connect Public Pages to Supabase
overview: ""
todos: []
isProject: false
---

# Step 9: Connect Public Pages to Supabase

## Goal

Replace every hardcoded `*-data.ts` import across the 6 public pages with live Supabase queries. This step establishes a typed service layer (`src/services/`) that fetches data server-side and maps DB rows to the component types already used by each page. After this step the site is truly dynamic: a record change in Supabase is reflected on the public site after ISR revalidation.

---

## Prerequisites

- Step 8 is complete: schema migrations applied against prod, RLS active, Storage buckets created.
- `src/lib/supabase/server.ts` exports `createSupabaseServerClient()`.
- `src/types/database.ts` has all Row interfaces.
- `supabase/seed.ts` already exists. No SQL seed migration needed.
- **Docker is installed** (required for local Supabase). Task 0 below sets up the local environment.
- After Task 0: `.env.local` points to the **local** Supabase instance, never to prod.

### Seed vs. Static Data Discrepancies

The existing `supabase/seed.ts` differs from the static `-data.ts` files in three ways that affect the service mappers:

| Area                    | Seed value                                                                | Static data / type expectation                                                          | Fix                                                  |
| ----------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Gallery `category`      | slug: `"sensei-luciano"`, `"belt-ceremonies"`, `"kids"`, `"dojo"`         | display name: `"Sensei Luciano"`, `"Cerimônias de Faixa"`, `"Aulas Infantis"`, `"Dojo"` | Add slug→display mapper in `gallery.ts`              |
| Gallery `aspect_ratio`  | word: `"portrait"`, `"landscape"`, `"square"`                             | fraction: `"3/4"`, `"16/9"`, `"1/1"`                                                    | Update `ASPECT_CLASS` map in `gallery.ts`            |
| Schedule `day_group_id` | category-agnostic: `"seg-qua-sex"` used for both infantil **and** adultos | `DayGroup` expects one category per group                                               | Group by `${day_group_id}-${category}` composite key |

These are resolved inside the service mappers — **the seed does not need to be changed**.

---

## Current Project Conventions to Follow

- **Services:** Pure async functions in `src/services/<entity>.ts`, each calling `createSupabaseServerClient()`. No business logic in pages.
- **Mapper functions:** Defined inside the service file. Pure, no side effects. Named `toXxx(row)`.
- **Fallback:** Every service falls back to static `-data.ts` data on Supabase error or empty result — so the site never crashes during development even without a seeded DB.
- **Caching:** `export const revalidate = 3600` (1-hour ISR) on every public page.
- **Server Components only:** All 6 pages remain Server Components. Only Client Components receive pre-fetched data as props.
- **Imports:** `@/services/...`, `@/types/...`, `@/lib/supabase/server`.
- **Type safety:** Services return the same component types already used by each page (`Sensei`, `DayGroup`, `GalleryImage`, etc.).

---

## Files Overview

### New files to create

```
supabase/migrations/
  20260309_05_add_sensei_fields.sql -- add quote + organization columns to senseis

src/services/
  senseis.ts          -- founder + instructors
  schedules.ts        -- schedule rows grouped into DayGroup[]
  gallery.ts          -- gallery images
  championships.ts    -- events + hall of fame + dojo stats
  testimonials.ts     -- home testimonials
  plans.ts            -- pricing plans, belt exams, drop-in, FAQ

e2e/
  supabase-public-pages.spec.ts     -- E2E smoke tests per page
```

### Files to modify

```
src/types/database.ts                               -- add quote + organization to SenseiRow
src/app/page.tsx                                    -- async, fetch testimonials
src/app/senseis/page.tsx                            -- async, fetch senseis
src/app/horarios/page.tsx                           -- async, fetch schedule groups
src/app/galeria/page.tsx                            -- async, fetch images, pass as prop
src/app/campeonatos/page.tsx                        -- async, fetch championships data
src/app/planos/page.tsx                             -- async, fetch plans data

src/components/home/testimonials-section.tsx        -- add testimonials prop
src/components/campeonatos/championships-hero.tsx   -- add cards prop
src/components/campeonatos/championships-hall-of-fame.tsx -- add athletes prop
src/components/galeria/gallery-masonry-grid.tsx     -- add images prop
src/components/planos/plans-pricing-grid.tsx        -- add plans prop
src/components/planos/plans-belt-exam.tsx           -- add exams prop
src/components/planos/plans-drop-in.tsx             -- add items prop
src/components/planos/plans-faq.tsx                 -- add items prop
```

### Stays static (no DB fetch)

| Data                                | Location               | Why                                    |
| ----------------------------------- | ---------------------- | -------------------------------------- |
| `LOCATION` (address/phone/mapsHref) | `horarios-data.ts`     | Config constant, never changes via CMS |
| `HeroSection` content               | `hero-section.tsx`     | Fully static marketing copy            |
| `BenefitsSection` content           | `benefits-section.tsx` | Fully static marketing copy            |

---

## Task 0 — Local Supabase Environment

> **Why:** `.env.local` currently points to the production Supabase project. All development work should run against a local instance so accidental writes, schema experiments, and seed data never touch prod data.

### 0.1 — Install Supabase CLI as dev dependency

```bash
pnpm add -D supabase
```

This pins the CLI version to the project so every developer uses the same version via `pnpm`.

Add scripts to `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest",
  "test-e2e": "playwright test",
  "db:start": "supabase start",
  "db:stop": "supabase stop",
  "db:reset": "supabase db reset",
  "db:seed": "tsx supabase/seed.ts",
  "db:studio": "supabase studio"
}
```

### 0.2 — Initialize Supabase CLI

```bash
pnpm supabase init
```

This creates `supabase/config.toml`. Accept all defaults. The `supabase/migrations/` directory already exists and will be picked up automatically.

### 0.3 — Link to the production project (one-time)

```bash
pnpm supabase login
pnpm supabase link --project-ref <your-project-ref>
```

The project ref is the subdomain in your Supabase URL: `https://<project-ref>.supabase.co`. This stores the link in `supabase/.temp/` (git-ignored) and enables `supabase db pull` to sync remote schema if needed.

### 0.4 — Start local Supabase

```bash
pnpm db:start
```

First run pulls Docker images (~600 MB) and starts the local stack. Subsequent starts are instant. The command prints:

```
API URL:     http://localhost:54321
DB URL:      postgresql://postgres:postgres@localhost:54322/postgres
Studio URL:  http://localhost:54323
anon key:    eyJ...
service_role key: eyJ...
```

Copy those two keys — you will need them in the next step.

### 0.5 — Create `.env.local` (local) and `.env.production.local` (prod)

**Rename the current `.env.local` to `.env.production.local`** to preserve the prod credentials:

```bash
mv .env.local .env.production.local
```

Next.js loads `.env.production.local` only during `pnpm build` / `pnpm start`. It is never loaded during `pnpm dev`, so the local instance is used automatically during development.

Create a new `**.env.local**` pointing to the local Supabase instance:

```bash
# .env.local  — LOCAL Supabase (safe to commit if you want, keys are public for local dev)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase start output>
```

> **Note:** Both `.env.local` and `.env.production.local` are already in `.gitignore` — never commit either file.

Create `**.env.example` (safe to commit, no real secrets) so other developers know what vars are required:

```bash
# .env.example — copy to .env.local and fill in values
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 0.6 — Apply migrations + seed locally

Migrations are applied automatically by `supabase start` / `supabase db reset`. To reset and re-apply cleanly:

```bash
pnpm db:reset        # drops local DB, re-runs all migrations in supabase/migrations/
pnpm db:seed         # populates all tables from supabase/seed.ts
```

The `db:reset` command runs all `*.sql` files in `supabase/migrations/` in filename order. This includes the new migration from Task 1 (`20260309_05_add_sensei_fields.sql`) once it exists.

### 0.7 — Verify local stack

```bash
open http://localhost:54323   # Supabase Studio (table editor, SQL runner)
pnpm dev                      # Next.js — now connected to local Supabase
```

Visit each public page and confirm the seed data renders (still static data since services aren't written yet — that's Tasks 3–8).

### 0.8 — Workflow going forward

| Command          | When to use                                                    |
| ---------------- | -------------------------------------------------------------- |
| `pnpm db:start`  | Start of every dev session                                     |
| `pnpm db:stop`   | End of dev session (frees Docker resources)                    |
| `pnpm db:reset`  | After pulling new migrations from git, or to get a clean slate |
| `pnpm db:seed`   | After reset, to repopulate tables                              |
| `pnpm db:studio` | Open local Studio in browser                                   |
| `pnpm build`     | Uses `.env.production.local` → connects to prod Supabase       |
| `pnpm dev`       | Uses `.env.local` → connects to local Supabase                 |

### 0.9 — Applying new migrations to prod

When a migration is ready (e.g. `20260309_05_add_sensei_fields.sql` from Task 1):

```bash
# Option A — Supabase Dashboard SQL Editor (paste the SQL manually)
# Option B — CLI push (requires the project to be linked)
pnpm supabase db push
```

`db push` compares local migrations against what's been applied on prod and runs only the new ones. Safe to run multiple times — already-applied migrations are skipped.

---

## Task 1 — DB Addition: Sensei Extra Fields

The `FounderSensei` type requires `quote` (a philosophy quote) and `organization` (e.g. "Shotokan Karate International"), but these columns are missing from the current `senseis` table. Add them via a new migration.

**Create `supabase/migrations/20260309_05_add_sensei_fields.sql`:**

```sql
-- Add display fields that FounderSensei component needs
ALTER TABLE senseis
  ADD COLUMN IF NOT EXISTS quote        TEXT,
  ADD COLUMN IF NOT EXISTS organization TEXT;
```

**Apply:** Run in Supabase Dashboard → SQL Editor.

**Update `src/types/database.ts` — add fields to `SenseiRow`:**

```ts
export interface SenseiRow {
  // ... existing fields ...
  quote: string | null; // NEW: philosophy quote (founder only)
  organization: string | null; // NEW: e.g. "Shotokan Karate International"
}
```

Also update `SenseiInsert` accordingly:

```ts
export type SenseiInsert = Omit<SenseiRow, "id" | "created_at" | "updated_at">;
// (no change needed — quote/organization are included automatically)
```

---

## Task 2 — Seed Data Migration

Create `supabase/migrations/20260309_04_seed.sql`. This translates every `-data.ts` static file into `INSERT` statements. Run once in the Supabase Dashboard SQL Editor.

**Apply order matters** — run 04 before 05, or add the new columns first.

The seed must cover all showcase tables:

### senseis (founder + 3 instructors)

```sql
INSERT INTO senseis (name, rank, specialty, bio, quote, organization, photo_url, is_founder, display_order) VALUES
(
  'Sensei Luciano dos Santos',
  'Faixa Preta 5º Dan',
  NULL,
  'Com mais de 25 anos de dedicação ininterrupta ao Karate Shotokan, o Sensei Luciano acredita que o verdadeiro dojo está dentro de cada um de nós. Sua jornada começou aos 6 anos de idade, e desde então, ele tem transformado vidas através da disciplina marcial.\n\nSua filosofia de ensino foca não apenas na técnica perfeita, mas no desenvolvimento do caráter. "Disciplina, respeito e superação constante" são os pilares que sustentam cada aula ministrada no dojo.',
  'O Karate não é sobre ser melhor que o outro, é sobre ser melhor do que você era ontem. O verdadeiro oponente está dentro de você.',
  'Shotokan Karate International',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDFpBzKXfJIKNRExcdf0Zr38-fsPdCSH5GtqRp7CpDXnaWBaCdb3b0wr_BEiOe8fFMGEtzIYfaoljoTWgFzgxiWyL_kcYPtp7--CV2X_e0xLyCDM4mVlhZKHuhzyWykntPui5dz7bHVavzbw438qiYCbqdKvToklFM5fo5LVNb9_B6LtXrRWcZ6et70nUaU4jzciu54wWxVj4-D97qgpgRjtJ2VjBCWJVRm7YcOOSAMLi8e_8LToebqrE85pKNAH3gGzv47kgK4tWnM',
  true,
  0
),
(
  'Sensei Anna Santos',
  '3º Dan - Especialista Pedagógica',
  'Infantil',
  'Com formação em Educação Física e especialização em desenvolvimento motor infantil, Anna torna o aprendizado do Karate lúdico e disciplinado para crianças.',
  NULL, NULL,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDIosygA2Jje56ugPwcQZK4utH7WLK7SKwl_cVTRkKDvV1-LN7T5FbnFmjsxBwZD4jpddv8WNBotL2trHfHVL7UTPlJq4c8GbHVg_Pe5NdlCoMl3lS0lm4VvJtMlygAwn5ZxD5m3Zo0qAzpnvmIpGkVsAbL1syGqUgRsO4oFUvhC8a_3ci8D3Urc40ZzzHL6b4Q6ETCqrikCpPMQ4umURGCZt-C6AnQZT2oBoMWlXLMX2qe9W3HajagJXtA938W9a2Ido6N4NEiGI1u',
  false,
  1
),
(
  'Sensei Wynner Armoa',
  '4º Dan - Técnico Nacional',
  'Kata & Técnica',
  'Meticuloso e detalhista, Sensei Wynner foca na perfeição dos movimentos (Kata) e na aplicação técnica (Bunkai), elevando o nível técnico do dojo.',
  NULL, NULL,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8nnrJM0ENCyHww4Pe43-4SRsrnwxHq0phyMIxOA5fs8l9lKM-bHzGxkOK3pCO8mS9Xr2kwvC0a3bruWRFHxh8Z3UxRE08kxloRJX4EnsfbPm7sa0sPoXIgtwinX_I10M6vdG6VulDdzWMqXbzqCIpG_RJeg0Dn2wmNLh9qbuXWZZHxblm_I2gTt-cVRb-jOX-OXbBUEokJRHz32ORvsR6p4mFT2YNLJqlNNaw0YAVBCcfBsnFd6LhXxkHTbqNhtfedNfQS6wil3kc',
  false,
  2
),
(
  'Sensei Letícia Mendez',
  '3º Dan - Ex-Atleta Olímpica',
  'Alto Rendimento',
  'Responsável pela equipe de competição, Letícia traz sua experiência internacional para preparar atletas de alto rendimento com foco em Kumite.',
  NULL, NULL,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDqxwiuYSn8cowNjVdejtBj0QScYltfSrh9vY_ah43Nl0r3GK_dtzJfdOX_vzUbZfNi_A5E_B4sESfs6st9CRZTYgA98Q8D_IvrNUF9IS2V56eMGwJrtIXXHaCfvoZn5XxQVrGtydXWOA8I07419QuUXY4exBpi5wc94C5Mg8UH-3vPag9CFPQeNl1U05DHj4Ijz27YuwTGnwc92raiyfrkmutaUDvZRZlq84KlmpGHYN8RA7Q4pvNBsV9DJmF9HYgcl4ZWCIWmiHJG',
  false,
  3
);
```

### testimonials (3 rows)

```sql
INSERT INTO testimonials (author, role, quote, display_order) VALUES
('Ana Paula Silva', 'Mãe de aluno', 'Meu filho melhorou muito a concentração na escola depois que começou a treinar. O Sensei Luciano é incrível com as crianças, ensinando respeito e disciplina de forma divertida.', 0),
('Ricardo Oliveira', 'Aluno Faixa Verde', 'Comecei o karate aos 40 anos buscando uma atividade física e encontrei uma filosofia de vida. Perdi peso, ganhei confiança e fiz grandes amigos no dojo.', 1),
('Mariana Costa', 'Aluna Iniciante', 'A defesa pessoal ensinada aqui é prática e eficiente. Me sinto muito mais segura no meu dia a dia. Recomendo para todas as mulheres!', 2);
```

### schedules (8 rows — same as SCHEDULE_GROUPS slots)

```sql
INSERT INTO schedules (day_group_id, day_label, time_start, time_end, category, instructor, display_order) VALUES
-- Seg/Qua/Sex Infantil
('seg-qua-sex-infantil', 'Segunda / Quarta / Sexta', '16:00', '17:00', 'infantil', 'Sensei Anna Santos', 0),
('seg-qua-sex-infantil', 'Segunda / Quarta / Sexta', '18:15', '19:15', 'infantil', 'Sensei Luciano dos Santos', 1),
-- Ter/Qui Infantil
('ter-qui-infantil', 'Terça / Quinta', '09:00', '10:00', 'infantil', 'Sensei Wynner Armoa', 2),
('ter-qui-infantil', 'Terça / Quinta', '16:00', '17:00', 'infantil', 'Sensei Anna Santos', 3),
('ter-qui-infantil', 'Terça / Quinta', '17:00', '18:00', 'infantil', 'Sensei Letícia Mendez', 4),
('ter-qui-infantil', 'Terça / Quinta', '18:15', '19:15', 'infantil', 'Sensei Letícia Mendez', 5),
-- Seg/Qua/Sex Adultos
('seg-qua-sex-adultos', 'Segunda / Quarta / Sexta', '06:30', '07:30', 'adultos', 'Sensei Wynner Armoa', 6),
('seg-qua-sex-adultos', 'Segunda / Quarta / Sexta', '19:30', '21:00', 'adultos', 'Sensei Luciano dos Santos', 7),
-- Ter/Qui Adultos
('ter-qui-adultos', 'Terça / Quinta', '07:00', '08:00', 'adultos', 'Sensei Letícia Mendez', 8),
('ter-qui-adultos', 'Terça / Quinta', '19:30', '21:00', 'adultos', 'Sensei Luciano dos Santos', 9);
```

### gallery_images (8 rows)

Use the category display names exactly as used by `GalleryCategory` type
("Sensei Luciano", "Cerimônias de Faixa", "Aulas Infantis", "Dojo") so the filter works without mapping.

```sql
INSERT INTO gallery_images (title, category, image_url, aspect_ratio, display_order) VALUES
('Sensei Luciano',      'Sensei Luciano',       '<url>', '3/4',  0),
('Kata em Grupo',       'Sensei Luciano',       '<url>', '4/3',  1),
('Pequenos Guerreiros', 'Aulas Infantis',       '<url>', '1/1',  2),
('Graduação',           'Cerimônias de Faixa',  '<url>', '9/16', 3),
('Nosso Tatame',        'Dojo',                 '<url>', '16/9', 4),
('Preparação Mental',   'Dojo',                 '<url>', '1/1',  5),
('Treino de Chute',     'Sensei Luciano',       '<url>', '3/4',  6),
('A Faixa Preta',       'Cerimônias de Faixa',  '<url>', '16/9', 7);
-- Replace <url> with actual lh3.googleusercontent.com URLs from galeria-data.ts
```

### dojo_stats (1 row)

```sql
INSERT INTO dojo_stats (total_gold, total_silver, total_bronze, total_trophies)
VALUES (127, 84, 56, 15);
```

### hall_of_fame (4 rows)

```sql
INSERT INTO hall_of_fame (name, achievement, photo_url, display_order) VALUES
('Sensei Luciano', 'Campeão Mundial 2022',   NULL, 0),
('Ana Silva',      'Campeã Brasileira 2023',  NULL, 1),
('Pedro Santos',   'Ouro Pan-Americano',      NULL, 2),
('Julia Costa',    'Tricampeã Estadual',       NULL, 3);
```

### championships (3 events + results)

```sql
INSERT INTO championships (name, event_date, location, status, gold, silver, bronze, display_order) VALUES
('Campeonato Paulista de Karate 2024', '2024-03-15', 'Ginásio do Ibirapuera, São Paulo', 'finalizado', 5, 2, 3, 0),
('Copa Brasil de Clubes',             '2023-11-10', 'Rio de Janeiro, RJ',                'finalizado', 2, 4, 1, 1),
('Open Internacional',                '2023-08-14', 'Curitiba, PR',                      'finalizado', 8, 3, 5, 2);

-- championship_results (reference championship IDs after insert)
-- Use a CTE or subselect to get IDs:
WITH champ AS (SELECT id, name FROM championships)
INSERT INTO championship_results (championship_id, athlete_name, placement, category)
SELECT c.id, r.athlete_name, r.placement, r.category
FROM champ c
JOIN (VALUES
  ('Campeonato Paulista de Karate 2024', 'João Oliveira',    1, 'Kumite -75kg'),
  ('Campeonato Paulista de Karate 2024', 'Mariana Costa',    1, 'Kata Individual'),
  ('Campeonato Paulista de Karate 2024', 'Carlos Mendes',    2, 'Kumite +84kg'),
  ('Campeonato Paulista de Karate 2024', 'Equipe Masculina', 3, 'Kata Equipe'),
  ('Copa Brasil de Clubes',             'Sensei Luciano',   1, 'Master Kata'),
  ('Copa Brasil de Clubes',             'Julia Costa',      1, 'Kumite -55kg'),
  ('Copa Brasil de Clubes',             'Pedro Santos',     2, 'Kumite -67kg')
) AS r(champ_name, athlete_name, placement, category) ON c.name = r.champ_name;
```

### plans (3 rows — JSONB tiers)

```sql
INSERT INTO plans (plan_key, title, subtitle, recommended, tiers, display_order) VALUES
('tres-vezes', '3x por Semana', 'Treino intenso para máxima evolução', false,
 '[{"label":"Mês","price":"R$ 300,00","isMonthlyHighlight":true},{"label":"Trimestral","price":"R$ 280,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Semestral","price":"R$ 270,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Anual","price":"R$ 250,00","isMonthlyHighlight":false,"suffix":"/mês"}]',
 0),
('duas-vezes', '2x por Semana', 'Equilíbrio ideal de rotina', true,
 '[{"label":"Mês","price":"R$ 280,00","isMonthlyHighlight":true},{"label":"Trimestral","price":"R$ 270,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Semestral","price":"R$ 250,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Anual","price":"R$ 240,00","isMonthlyHighlight":false,"suffix":"/mês"}]',
 1),
('familia', 'Família', 'Treinem juntos com desconto', false,
 '[{"label":"Mês","price":"R$ 250,00","isMonthlyHighlight":true},{"label":"Trimestral","price":"R$ 240,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Semestral","price":"R$ 225,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Anual","price":"R$ 215,00","isMonthlyHighlight":false,"suffix":"/mês"}]',
 2);
```

### belt_exams (4 rows)

```sql
INSERT INTO belt_exams (belt, price, family_price, highlighted, display_order) VALUES
('Branca até Verde',      'R$ 210,00', 'Família: R$ 200,00', true,  0),
('Verde para Roxa',       'R$ 250,00', 'Família: R$ 230,00', true,  1),
('Roxa para Marrom',      'R$ 300,00', 'Família: R$ 250,00', true,  2),
('Valor da Faixa Simples','R$ 45,00',  'Família: R$ 40,00',  false, 3);
```

### drop_in_classes (2 rows)

```sql
INSERT INTO drop_in_classes (label, price, display_order) VALUES
('Aula Avulsa (Dojo)',           'R$ 60,00', 0),
('Alto Rendimento / Competição', 'R$ 30,00', 1);
```

### faq_items (4 rows)

```sql
INSERT INTO faq_items (question, answer, display_order) VALUES
('Preciso comprar o kimono logo no início?',    'Não é obrigatório para as primeiras aulas experimentais. Após o primeiro mês, o kimono é necessário.', 0),
('Como funcionam os exames de faixa?',          'Os exames de faixa ocorrem a cada 3 a 6 meses conforme o estágio e desenvolvimento técnico. O sensei avalia e aprova.', 1),
('Posso trancar o plano em caso de lesão?',     'Sim. Com atestado médico, o plano pode ser congelado por até 60 dias sem custo adicional.', 2),
('Quais são as formas de pagamento aceitas?',   'Aceitamos cartão de crédito (recorrência), débito, PIX e dinheiro. Planos trimestrais e anuais podem ser parcelados no cartão.', 3);
```

---

## Task 3 — Service: `src/services/senseis.ts`

**Mapper rules:**

| DB column      | Component field                   | Notes                                                     |
| -------------- | --------------------------------- | --------------------------------------------------------- |
| `name`         | `name`                            | direct                                                    |
| `rank`         | `rank`                            | direct                                                    |
| `specialty`    | `specialty`                       | fallback `""`                                             |
| `bio`          | `bio` (FounderSensei: `string[]`) | split on `\n\n` for founder; plain string for instructors |
| `quote`        | `quote`                           | fallback `""`                                             |
| `organization` | `organization`                    | fallback `"Shotokan Karate International"`                |
| `photo_url`    | `photoUrl`                        | fallback `""`                                             |
| —              | `photoAlt`                        | generate: `${name} em pose de karate`                     |
| —              | `profileHref`                     | hardcode `"#"` for now (Step 11 will add profile pages)   |

```ts
// src/services/senseis.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FounderSensei, Sensei } from "@/types/sensei";
import type { SenseiRow } from "@/types/database";

function toFounderSensei(row: SenseiRow): FounderSensei {
  return {
    name: row.name,
    rank: row.rank,
    organization: row.organization ?? "Shotokan Karate International",
    bio: (row.bio ?? "").split("\n\n").filter(Boolean),
    quote: row.quote ?? "",
    photoUrl: row.photo_url ?? "",
    photoAlt: `${row.name} em pose de karate`,
  };
}

function toSensei(row: SenseiRow): Sensei {
  return {
    id: row.id,
    name: row.name,
    rank: row.rank,
    specialty: row.specialty ?? "",
    bio: row.bio ?? "",
    photoUrl: row.photo_url ?? "",
    photoAlt: `Retrato do ${row.name}`,
    profileHref: "#",
  };
}

export async function getSenseis(): Promise<{
  founder: FounderSensei;
  instructors: Sensei[];
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("senseis")
    .select("*")
    .order("display_order");

  if (error || !data?.length) {
    // Fallback to static data so the page never crashes
    const { FOUNDER, INSTRUCTORS } =
      await import("@/components/senseis/senseis-data");
    return { founder: FOUNDER, instructors: INSTRUCTORS };
  }

  const founderRow = data.find((r) => r.is_founder);
  const instructorRows = data.filter((r) => !r.is_founder);

  if (!founderRow) {
    const { FOUNDER, INSTRUCTORS } =
      await import("@/components/senseis/senseis-data");
    return { founder: FOUNDER, instructors: INSTRUCTORS };
  }

  return {
    founder: toFounderSensei(founderRow),
    instructors: instructorRows.map(toSensei),
  };
}
```

---

## Task 4 — Service: `src/services/schedules.ts`

**Grouping logic:** The seed uses category-agnostic `day_group_id` values (`"seg-qua-sex"`, `"ter-qui"`) shared across both infantil and adultos rows. Grouping by `day_group_id` alone would merge both categories into one `DayGroup`, which is wrong — `DayGroup` has exactly one `category`. Use a **composite key** `${day_group_id}-${category}` as the map key.

**Mapper rules:**

| DB                      | Component              | Notes                                           |
| ----------------------- | ---------------------- | ----------------------------------------------- |
| `day_group_id`          | `id`                   | use composite key as `id` for stable React keys |
| `day_label`             | `label`                | direct                                          |
| `category: "infantil"`  | `category: "Infantil"` | capitalize                                      |
| `category: "adultos"`   | `category: "Adultos"`  | capitalize                                      |
| `time_start + time_end` | `slot.time`            | `${time_start} - ${time_end}`                   |
| `instructor`            | `slot.sensei`          | fallback `""`                                   |
| —                       | `isPrimary`            | `day_group_id.startsWith("seg")`                |

```ts
// src/services/schedules.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DayGroup } from "@/types/schedule";
import type { ScheduleRow } from "@/types/database";

function groupRows(rows: ScheduleRow[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const row of rows) {
    const slot = {
      time: `${row.time_start} - ${row.time_end}`,
      sensei: row.instructor ?? "",
    };
    // Composite key: seed reuses the same day_group_id for both categories
    const key = `${row.day_group_id}-${row.category}`;
    const existing = map.get(key);
    if (existing) {
      existing.slots.push(slot);
    } else {
      map.set(key, {
        id: key,
        label: row.day_label,
        category: row.category === "infantil" ? "Infantil" : "Adultos",
        slots: [slot],
        isPrimary: row.day_group_id.startsWith("seg"),
      });
    }
  }
  return Array.from(map.values());
}

export async function getScheduleGroups(): Promise<DayGroup[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .order("display_order");

  if (error || !data?.length) {
    const { SCHEDULE_GROUPS } =
      await import("@/components/horarios/horarios-data");
    return SCHEDULE_GROUPS;
  }
  return groupRows(data);
}
```

---

## Task 5 — Service: `src/services/gallery.ts`

**Mapper rules:**

| DB             | Component     | Notes                                |
| -------------- | ------------- | ------------------------------------ |
| `id`           | `id`          | direct                               |
| `image_url`    | `src`         | rename                               |
| `title`        | `title`       | direct                               |
| `title`        | `alt`         | reuse title as alt text              |
| `category`     | `category`    | DB stores display names; direct cast |
| `aspect_ratio` | `aspectClass` | map via lookup table                 |

**Two lookup tables required.** The seed stores `aspect_ratio` as words (`"portrait"`, `"landscape"`, `"square"`) and `category` as slugs (`"sensei-luciano"`, `"belt-ceremonies"`, `"kids"`, `"dojo"`), but the component types expect Tailwind class strings and display names respectively.

```ts
// src/services/gallery.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { GalleryImage } from "@/types/gallery";
import type { GalleryImageRow } from "@/types/database";

// Maps seed aspect_ratio words to Tailwind classes (seed uses "portrait"/"landscape"/"square")
const ASPECT_CLASS: Record<string, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[16/9]",
  square: "aspect-square",
  // fraction format kept for forward-compatibility
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "16/9": "aspect-[16/9]",
  "9/16": "aspect-[9/16]",
};

// Maps seed category slugs to GalleryCategory display names
const CATEGORY_DISPLAY: Record<string, GalleryImage["category"]> = {
  "sensei-luciano": "Sensei Luciano",
  "belt-ceremonies": "Cerimônias de Faixa",
  kids: "Aulas Infantis",
  dojo: "Dojo",
};

function toGalleryImage(row: GalleryImageRow): GalleryImage {
  return {
    id: row.id,
    src: row.image_url,
    alt: row.title,
    title: row.title,
    category:
      CATEGORY_DISPLAY[row.category] ??
      (row.category as GalleryImage["category"]),
    aspectClass: ASPECT_CLASS[row.aspect_ratio] ?? "aspect-[4/3]",
  };
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("display_order");

  if (error || !data?.length) {
    const { GALLERY_IMAGES } =
      await import("@/components/galeria/galeria-data");
    return GALLERY_IMAGES;
  }
  return data.map(toGalleryImage);
}
```

---

## Task 6 — Service: `src/services/championships.ts`

This service makes **three queries** and returns a single object to avoid waterfall fetching in the page.

**Dojo stats → 4 MedalCounterCards** (static structure, values from DB):

```ts
function toMedalCards(stats: DojoStatsRow): MedalCounterCard[] {
  return [
    {
      label: "Ouro",
      count: stats.total_gold,
      iconName: "military_tech",
      iconColorClass: "text-yellow-400",
      cardVariant: "default",
    },
    {
      label: "Prata",
      count: stats.total_silver,
      iconName: "military_tech",
      iconColorClass: "text-slate-300",
      cardVariant: "default",
    },
    {
      label: "Bronze",
      count: stats.total_bronze,
      iconName: "military_tech",
      iconColorClass: "text-orange-400",
      cardVariant: "default",
    },
    {
      label: "Troféus Gerais",
      count: stats.total_trophies,
      iconName: "emoji_events",
      iconColorClass: "text-white",
      cardVariant: "primary",
    },
  ];
}
```

**Hall of fame → achievementColorClass by index** (display_order):

```ts
const HOF_COLORS = [
  "text-yellow-400", // 1st
  "text-primary", // 2nd
  "text-orange-400", // 3rd
  "text-slate-300", // 4th
];

function toHallOfFameAthlete(
  row: HallOfFameRow,
  index: number,
): HallOfFameAthlete {
  return {
    id: row.id,
    name: row.name,
    achievement: row.achievement,
    achievementColorClass: HOF_COLORS[index] ?? "text-white",
    photoSrc: row.photo_url ?? "/images/campeonatos/placeholder.jpg",
    photoAlt: `${row.name} com troféu`,
  };
}
```

**Championships + nested results** — use Supabase relational select:

```ts
const { data: champs } = await supabase
  .from("championships")
  .select("*, championship_results(*)")
  .order("display_order");
```

`**event_date` formatting (ISO `"2024-03-15"` → `"15/03/2024"`):

```ts
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
```

**Status mapping:**

```ts
function formatStatus(status: ChampionshipRow["status"]): string {
  const map = {
    finalizado: "Finalizado",
    "em-andamento": "Em Andamento",
    futuro: "Futuro",
  };
  return map[status] ?? status;
}
```

**Full return type:**

```ts
export async function getChampionshipsPageData(): Promise<{
  medalCards: MedalCounterCard[];
  hallOfFame: HallOfFameAthlete[];
  events: ChampionshipEvent[];
}>;
```

Run all three queries in parallel with `Promise.all`.

---

## Task 7 — Service: `src/services/testimonials.ts`

Near 1-to-1 mapping. Return the shape the component already expects:

```ts
export type TestimonialItem = Pick<TestimonialRow, "author" | "role" | "quote">;

export async function getTestimonials(): Promise<TestimonialItem[]>;
```

Fallback to the hardcoded array inside `testimonials-section.tsx` (move it to a named export in that file so the fallback can import it).

---

## Task 8 — Service: `src/services/plans.ts`

**Key type conflict:** `BeltExamRow` in `src/types/database.ts` uses `family_price` (snake_case), but `BeltExamRow` in `src/types/plans.ts` uses `familyPrice` (camelCase). The mapper converts.

```ts
import type {
  PricingPlan,
  BeltExamRow as PlansBeltExam,
  DropInItem,
  FaqItem,
} from "@/types/plans";
import type {
  BeltExamRow,
  DropInClassRow,
  FaqItemRow,
  PlanRow,
} from "@/types/database";

function toPricingPlan(row: PlanRow): PricingPlan {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    recommended: row.recommended,
    tiers: row.tiers,
  };
}

function toBeltExam(row: BeltExamRow): PlansBeltExam {
  return {
    id: row.id,
    belt: row.belt,
    price: row.price,
    familyPrice: row.family_price,
    highlighted: row.highlighted,
  };
}

function toDropIn(row: DropInClassRow): DropInItem {
  return { id: row.id, label: row.label, price: row.price };
}

function toFaqItem(row: FaqItemRow): FaqItem {
  return { id: row.id, question: row.question, answer: row.answer };
}

export async function getPlansPageData(): Promise<{
  plans: PricingPlan[];
  beltExams: PlansBeltExam[];
  dropIn: DropInItem[];
  faq: FaqItem[];
}>;
```

Run all four queries in parallel with `Promise.all`.

---

## Task 9 — Update Pages

All 6 pages become `async` Server Components and call their service. Add `export const revalidate = 3600` to each.

### `src/app/page.tsx`

```tsx
export const revalidate = 3600;

export default async function Home() {
  const testimonials = await getTestimonials();
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
```

### `src/app/senseis/page.tsx`

```tsx
export const revalidate = 3600;

export default async function SenseisPage() {
  const { founder, instructors } = await getSenseis();
  return (
    <>
      <FounderHero founder={founder} />
      <InstructorsGrid instructors={instructors} />
    </>
  );
}
```

### `src/app/horarios/page.tsx`

```tsx
export const revalidate = 3600;

export default async function HorariosPage() {
  const groups = await getScheduleGroups();
  return (
    <>
      {/* page header */}
      <LocationCard location={LOCATION} />
      <MapPlaceholder />
      <ScheduleFilter groups={groups} />
      <ScheduleCta />
    </>
  );
}
```

Note: `LOCATION` stays imported from `horarios-data.ts`.

### `src/app/galeria/page.tsx`

```tsx
export const revalidate = 3600;

export default async function GaleriaPage() {
  const images = await getGalleryImages();
  return (
    <>
      {/* page header */}
      <GalleryMasonryGrid images={images} />
      <GaleriaCta />
    </>
  );
}
```

### `src/app/campeonatos/page.tsx`

```tsx
export const revalidate = 3600;

export default async function CampeonatosPage() {
  const { medalCards, hallOfFame, events } = await getChampionshipsPageData();
  return (
    <>
      <ChampionshipsHero cards={medalCards} />
      <ChampionshipsHallOfFame athletes={hallOfFame} />
      <ChampionshipsTimeline events={events} />
      <ChampionshipsCta />
    </>
  );
}
```

### `src/app/planos/page.tsx`

```tsx
export const revalidate = 3600;

export default async function PlanosPage() {
  const { plans, beltExams, dropIn, faq } = await getPlansPageData();
  return (
    <>
      <PlansHero />
      <PlansPricingGrid plans={plans} />
      <div className="grid ...">
        <PlansBeltExam exams={beltExams} />
        <PlansDropIn items={dropIn} />
      </div>
      <PlansFaq items={faq} />
      <PlansCta />
    </>
  );
}
```

---

## Task 10 — Update Components

Each component drops its static data import and accepts the data as props.

### `src/components/home/testimonials-section.tsx`

Remove internal `TESTIMONIALS` const. Add prop:

```ts
type Testimonial = { author: string; role: string; quote: string };
interface Props { testimonials: Testimonial[] }
export function TestimonialsSection({ testimonials }: Props) { ... }
```

### `src/components/campeonatos/championships-hero.tsx`

Remove `MEDAL_COUNTER_CARDS` import. Add prop:

```ts
interface Props {
  cards: MedalCounterCard[];
}
export function ChampionshipsHero({ cards }: Props) {
  // Replace MEDAL_COUNTER_CARDS.map with cards.map
}
```

### `src/components/campeonatos/championships-hall-of-fame.tsx`

Remove `HALL_OF_FAME` import. Add prop:

```ts
interface Props {
  athletes: HallOfFameAthlete[];
}
export function ChampionshipsHallOfFame({ athletes }: Props) {
  // Replace HALL_OF_FAME.map with athletes.map
}
```

### `src/components/galeria/gallery-masonry-grid.tsx`

Remove `GALLERY_IMAGES` import. Add prop:

```ts
interface Props {
  images: GalleryImage[];
}
export function GalleryMasonryGrid({ images }: Props) {
  // Replace GALLERY_IMAGES references with images
}
```

Internal filter state and lightbox remain unchanged — they still work on the passed `images` array.

### `src/components/planos/plans-pricing-grid.tsx`

```ts
interface Props { plans: PricingPlan[] }
export function PlansPricingGrid({ plans }: Props) { ... }
```

### `src/components/planos/plans-belt-exam.tsx`

```ts
// BeltExamRow here is from @/types/plans (familyPrice camelCase)
interface Props { exams: BeltExamRow[] }
export function PlansBeltExam({ exams }: Props) { ... }
```

### `src/components/planos/plans-drop-in.tsx`

```ts
interface Props { items: DropInItem[] }
export function PlansDropIn({ items }: Props) { ... }
```

### `src/components/planos/plans-faq.tsx`

```ts
interface Props { items: FaqItem[] }
export function PlansFaq({ items }: Props) { ... }
```

---

## Task 11 — Caching Strategy

Add `export const revalidate = 3600;` to every public page file. This enables Next.js ISR: the page is statically cached at build time and regenerated in the background every 60 minutes.

No `Suspense` or `loading.tsx` skeleton is needed for pages that are fully server-rendered — the entire page renders on the server before the response is sent. Skeletons apply only to Client Components that fetch client-side, which is not the case here.

**Exception — gallery filter and schedule filter:** These Client Components receive their data as props on initial render (no client-side fetch), so no skeleton is needed for them either.

---

## Task 12 — Error Handling Strategy

Each service function follows the pattern:

```ts
const { data, error } = await supabase.from(...).select(...)...;
if (error || !data?.length) return <static-fallback>;
return data.map(mapper);
```

This means:

- If Supabase is unreachable → page renders with static data (no 500 error)
- If a table is empty → page renders with static data (safe during development)
- TypeScript errors in mapper functions will surface at build time

---

## Task 13 — Verify Data Flow (Manual QA)

After seed and service layer are in place:

1. `pnpm dev` — visit each page and confirm live data renders
2. In Supabase Dashboard, update one record (e.g. change a testimonial quote)
3. `curl -X GET http://localhost:3000/api/revalidate` is not needed — in dev, pages always refetch
4. Confirm the updated value appears on page refresh
5. Run `pnpm build && pnpm start` to verify ISR works in production mode

---

## Quality Tests

- `pnpm build` completes with zero TypeScript errors
- Each public page renders correct data from Supabase (compare to seed values)
- Mutate one Supabase record → change reflects on the page after cache revalidation
- All pages remain fully server-rendered (`curl` returns complete HTML, no `<script>` placeholders)
- Gallery filter and schedule category filter still work after switching from static data to props
- Supabase error simulation: temporarily revoke anon key → pages fall back to static data gracefully

---

## E2E Tests: `e2e/supabase-public-pages.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test.describe("Public pages — Supabase data integration", () => {
  test("home page renders testimonials", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "O que nossos alunos dizem",
        exact: true,
      }),
    ).toBeVisible();
    // At least one testimonial card is rendered
    await expect(page.locator("blockquote").first()).toBeVisible();
  });

  test("senseis page renders founder section", async ({ page }) => {
    await page.goto("/senseis");
    await expect(
      page.getByRole("heading", {
        name: "Sensei Luciano dos Santos",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByText("Faixa Preta 5º Dan")).toBeVisible();
    // Instructors grid renders at least one card
    await expect(
      page.locator('[data-testid="instructor-card"]').first(),
    ).toBeVisible();
    // OR: check for a known instructor name
    await expect(page.getByText("Sensei Anna Santos")).toBeVisible();
  });

  test("horarios page renders schedule cards", async ({ page }) => {
    await page.goto("/horarios");
    await expect(
      page.getByRole("heading", { name: "Horários e Turmas", exact: true }),
    ).toBeVisible();
    // Default filter shows Infantil schedules
    await expect(page.getByText("Segunda / Quarta / Sexta")).toBeVisible();
    // Switch to Adultos filter
    await page.getByRole("button", { name: "Adultos" }).click();
    await expect(page.getByText("19:30 - 21:00")).toBeVisible();
  });

  test("galeria page renders images and filter", async ({ page }) => {
    await page.goto("/galeria");
    await expect(
      page.getByRole("heading", { name: "Nossa Galeria", exact: true }),
    ).toBeVisible();
    // At least one image is rendered
    await expect(page.locator("img[alt]").first()).toBeVisible();
    // Filter pill exists
    await expect(
      page.getByRole("button", { name: "Sensei Luciano" }),
    ).toBeVisible();
    // Apply filter
    await page.getByRole("button", { name: "Sensei Luciano" }).click();
    await expect(page.locator("img[alt]").first()).toBeVisible();
  });

  test("campeonatos page renders medal counters and timeline", async ({
    page,
  }) => {
    await page.goto("/campeonatos");
    await expect(
      page.getByRole("heading", { name: /Nossas Conquistas/i }),
    ).toBeVisible();
    // Medal counters
    await expect(page.getByText("127")).toBeVisible(); // gold count from seed
    // Timeline has at least one event
    await expect(
      page.getByText("Campeonato Paulista de Karate 2024"),
    ).toBeVisible();
  });

  test("planos page renders pricing cards and FAQ", async ({ page }) => {
    await page.goto("/planos");
    await expect(
      page.getByRole("heading", { name: /Planos e Valores/i }),
    ).toBeVisible();
    // Recommended plan is visible
    await expect(page.getByText("2x por Semana")).toBeVisible();
    // FAQ accordion opens
    await page
      .getByRole("button", { name: "Preciso comprar o kimono logo no início?" })
      .click();
    await expect(
      page.getByText("Não é obrigatório para as primeiras aulas"),
    ).toBeVisible();
  });

  test("all public pages are server-rendered (full HTML in view-source)", async ({
    request,
  }) => {
    const pages = [
      "/",
      "/senseis",
      "/horarios",
      "/galeria",
      "/campeonatos",
      "/planos",
    ];
    for (const path of pages) {
      const res = await request.get(path);
      const html = await res.text();
      // Ensure each page has a non-empty body rendered server-side
      expect(html).toContain("<main");
    }
  });
});
```

**Run with:** `pnpm playwright test e2e/supabase-public-pages.spec.ts`
