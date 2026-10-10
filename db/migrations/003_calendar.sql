-- Tani's public booking calendar (blocked-until date + per-day open/closed overrides)
CREATE TABLE IF NOT EXISTS calendar_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  unavailable_until DATE NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_day_overrides (
  day DATE PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO calendar_settings (id, unavailable_until)
VALUES (1, '2026-11-10'::date)
ON CONFLICT (id) DO NOTHING;
