-- Link championship results and hall of fame entries to students table

ALTER TABLE championship_results
  ADD COLUMN IF NOT EXISTS student_id uuid REFERENCES students(id) ON DELETE SET NULL;

ALTER TABLE hall_of_fame
  ADD COLUMN IF NOT EXISTS student_id uuid REFERENCES students(id) ON DELETE SET NULL;
