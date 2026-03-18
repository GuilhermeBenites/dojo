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
