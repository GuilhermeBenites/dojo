-- Payment tracking for finance dashboard (manual mark-as-paid)
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS next_payment_date date;
