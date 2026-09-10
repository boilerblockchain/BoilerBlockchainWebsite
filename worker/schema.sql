CREATE TABLE IF NOT EXISTS submissions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  name       TEXT,
  email      TEXT,
  challenge  TEXT,
  onchain    TEXT,
  links      TEXT,
  writeup    TEXT,
  ip         TEXT,
  ua         TEXT
);

CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions (created_at DESC);
