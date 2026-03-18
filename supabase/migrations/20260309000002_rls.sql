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
