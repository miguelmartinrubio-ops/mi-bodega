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
  id         TEXT PRIMARY KEY NOT NULL,  -- UUID generado por la app (crypto.randomUUID)
  vino_id    INTEGER NOT NULL REFERENCES vinos(id) ON DELETE CASCADE,
  fecha      TEXT NOT NULL,              -- YYYY-MM-DD
  lugar      TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tomas_vino_id ON tomas(vino_id);
CREATE INDEX IF NOT EXISTS idx_tomas_fecha ON tomas(fecha);
