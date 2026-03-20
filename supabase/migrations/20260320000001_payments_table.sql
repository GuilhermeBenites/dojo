-- Payment types
CREATE TYPE payment_type AS ENUM (
  'mensalidade',
  'exame_faixa',
  'aula_particular',
  'outros'
);

-- Full payment history ledger
CREATE TABLE payments (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id    uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount        numeric(10,2) NOT NULL,
  payment_date  date NOT NULL DEFAULT CURRENT_DATE,
  payment_type  payment_type NOT NULL DEFAULT 'mensalidade',
  notes         text,
  created_at    timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX payments_student_id_idx ON payments(student_id);
CREATE INDEX payments_payment_date_idx ON payments(payment_date DESC);
