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
  -- Why the checker reached its conclusion: valid / valid_legacy /
  -- foreign_instance / wrong_challenge / forged / malformed / none.
  flag_verdict TEXT,
  -- Owner tag carried by the flag: which email's launch minted it.
  flag_owner   TEXT,
  writeup    TEXT,
  ip         TEXT,
  ua         TEXT,
  -- Soft delete: 1 hides the row from the dashboard. The row itself is never
  -- deleted, and /export still carries it with hidden=1.
  hidden     INTEGER DEFAULT 0,
  hidden_at  TEXT
);

CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions (created_at DESC);
-- Reuse detection looks a flag up on every submit.
CREATE INDEX IF NOT EXISTS idx_submissions_flag ON submissions (flag);

-- Migration for a database created before per-instance flags:
--   ALTER TABLE submissions ADD COLUMN flag_reused INTEGER DEFAULT 0;
--   ALTER TABLE submissions ADD COLUMN flag_verdict TEXT;
--   ALTER TABLE submissions ADD COLUMN flag_owner TEXT;

-- Migration for a database created before soft delete:
--   ALTER TABLE submissions ADD COLUMN hidden    INTEGER DEFAULT 0;
--   ALTER TABLE submissions ADD COLUMN hidden_at TEXT;
