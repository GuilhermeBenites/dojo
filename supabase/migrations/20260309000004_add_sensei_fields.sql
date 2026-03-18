-- Add display fields that FounderSensei component needs
ALTER TABLE senseis
  ADD COLUMN IF NOT EXISTS quote        TEXT,
  ADD COLUMN IF NOT EXISTS organization TEXT;
