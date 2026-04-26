-- Pre-visit questionnaire (idempotent: safe to re-run; skip if you already applied this in Neon)
-- Apply after 001_appointments.sql
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS intake_token TEXT,
  ADD COLUMN IF NOT EXISTS intake_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS intake_answers JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_intake_token
  ON appointments (intake_token)
  WHERE intake_token IS NOT NULL;
