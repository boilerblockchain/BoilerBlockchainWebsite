CREATE TABLE IF NOT EXISTS submissions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  name       TEXT,
  email      TEXT,
  challenge  TEXT,
  onchain    TEXT,
  links      TEXT,
  exploit    TEXT,
  flag       TEXT,
  flag_correct INTEGER DEFAULT 0,
  -- 1 when this exact (correct) flag was already handed in by someone else.
  -- Flags are minted per instance, so that only happens if it was passed around.
  flag_reused  INTEGER DEFAULT 0,
  writeup    TEXT,
  ip         TEXT,
  ua         TEXT
);

CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions (created_at DESC);
-- Reuse detection looks a flag up on every submit.
CREATE INDEX IF NOT EXISTS idx_submissions_flag ON submissions (flag);

-- Migration for a database created before per-instance flags:
--   ALTER TABLE submissions ADD COLUMN flag_reused INTEGER DEFAULT 0;
