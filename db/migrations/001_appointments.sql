-- Run against your Neon/Postgres instance (e.g. psql, Neon console).
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT appointments_starts_at_unique UNIQUE (starts_at)
);

CREATE INDEX IF NOT EXISTS idx_appointments_starts_at
  ON appointments (starts_at);

CREATE INDEX IF NOT EXISTS idx_appointments_range
  ON appointments (starts_at, ends_at);
