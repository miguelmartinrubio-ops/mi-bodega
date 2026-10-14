-- Esquema de mi-bodega para Turso (SQLite / libSQL)
-- Equivalente al esquema original de Supabase (Postgres):
--   bigint → INTEGER, real → REAL, uuid → TEXT, date/timestamptz → TEXT (ISO 8601)

CREATE TABLE IF NOT EXISTS vinos (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  bodega              TEXT,
  marca               TEXT,
  tipo                TEXT,
  grado               REAL,
  variedad            TEXT,
  region              TEXT,
  precio              TEXT,
  anadas_probadas     TEXT,
  anadas_recomendadas TEXT,
  comentarios         TEXT,
  tier                TEXT,
  estado              TEXT DEFAULT 'sin_clasificar',
  stock               INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tomas (
  id         TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  vino_id    INTEGER NOT NULL REFERENCES vinos(id) ON DELETE CASCADE,
  fecha      TEXT NOT NULL,
  lugar      TEXT,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_tomas_vino_id ON tomas(vino_id);
CREATE INDEX IF NOT EXISTS idx_tomas_fecha ON tomas(fecha);
