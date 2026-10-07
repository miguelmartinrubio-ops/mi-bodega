-- Esquema de mi-bodega para Turso (SQLite / libSQL)

CREATE TABLE IF NOT EXISTS vinos (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  marca               TEXT,
  bodega              TEXT,
  tipo                TEXT,
  grado               TEXT,
  variedad            TEXT,
  region              TEXT,
  precio              TEXT,
  anadas_probadas     TEXT,
  anadas_recomendadas TEXT,
  tier                TEXT,
  comentarios         TEXT,
  estado              TEXT,
  stock               INTEGER DEFAULT 0,
  created_at          TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS tomas (
  id         TEXT PRIMARY KEY,
  vino_id    INTEGER NOT NULL REFERENCES vinos(id) ON DELETE CASCADE,
  fecha      TEXT NOT NULL,
  lugar      TEXT,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_tomas_vino_id ON tomas(vino_id);
CREATE INDEX IF NOT EXISTS idx_tomas_fecha ON tomas(fecha);
