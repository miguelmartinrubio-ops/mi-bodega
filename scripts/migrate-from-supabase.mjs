// Copia los datos de Supabase a Turso.
//
// Uso:
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_KEY=<anon/publishable o service_role key> \
//   TURSO_DATABASE_URL=libsql://... \
//   TURSO_AUTH_TOKEN=... \
//   node scripts/migrate-from-supabase.mjs
//
// Crea las tablas (db/schema.sql) si no existen y copia vinos y tomas
// conservando sus ids. Es idempotente: las filas existentes se reemplazan.

import { readFile } from 'node:fs/promises'
import { createClient } from '@libsql/client'

const { SUPABASE_URL, SUPABASE_KEY, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env
for (const [k, v] of Object.entries({ SUPABASE_URL, SUPABASE_KEY, TURSO_DATABASE_URL })) {
  if (!v) { console.error(`Falta la variable de entorno ${k}`); process.exit(1) }
}

const turso = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN })

async function fetchAll(table) {
  const rows = []
  const pageSize = 1000
  for (let from = 0; ; from += pageSize) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=id`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Range: `${from}-${from + pageSize - 1}`,
      },
    })
    if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`)
    const page = await res.json()
    rows.push(...page)
    if (page.length < pageSize) return rows
  }
}

async function columnsOf(table) {
  const rs = await turso.execute(`PRAGMA table_info(${table})`)
  return new Set(rs.rows.map(r => r.name))
}

function toSqlValue(v) {
  if (v === undefined) return null
  if (typeof v === 'boolean') return v ? 1 : 0
  if (v !== null && typeof v === 'object') return JSON.stringify(v)
  return v
}

async function copy(table) {
  const rows = await fetchAll(table)
  const cols = await columnsOf(table)
  const skipped = new Set()
  const stmts = rows.map(row => {
    const keys = Object.keys(row).filter(k => cols.has(k) || (skipped.add(k), false))
    return {
      sql: `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
      args: keys.map(k => toSqlValue(row[k])),
    }
  })
  if (stmts.length) await turso.batch(stmts, 'write')
  console.log(`${table}: ${rows.length} filas copiadas`)
  if (skipped.size) console.warn(`  ⚠ columnas ignoradas (no existen en Turso): ${[...skipped].join(', ')}`)
}

const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8')
await turso.executeMultiple(schema)
await copy('vinos')
await copy('tomas')
console.log('Migración completada ✔')
