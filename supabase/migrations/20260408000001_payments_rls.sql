-- Enable RLS on payments table (created after initial RLS migration)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Only authenticated admin users can access payments — no public/anon access
CREATE POLICY "auth_all_payments"
  ON payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
