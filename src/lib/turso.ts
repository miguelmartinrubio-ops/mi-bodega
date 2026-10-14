import { createClient } from '@libsql/client/web'

const url = import.meta.env.VITE_TURSO_DATABASE_URL
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN

if (!url) throw new Error('Falta VITE_TURSO_DATABASE_URL en .env.local')

export const turso = createClient({ url, authToken })

// Ejecuta una consulta y devuelve las filas como objetos planos
export async function query<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const rs = await turso.execute({ sql, args })
  return rs.rows.map(row => {
    const obj: Record<string, unknown> = {}
    rs.columns.forEach((col, i) => { obj[col] = row[i] })
    return obj as T
  })
}

// Columnas editables de la tabla vinos (evita inyectar nombres de columna arbitrarios)
export const VINO_COLUMNS = [
  'marca', 'bodega', 'tipo', 'grado', 'variedad', 'region', 'precio',
  'anadas_probadas', 'anadas_recomendadas', 'tier', 'comentarios', 'estado', 'stock',
] as const

export function pickVinoFields(form: Record<string, any>) {
  return VINO_COLUMNS
    .filter(c => form[c] !== undefined)
    .map(c => [c, form[c] === '' ? null : form[c]] as const)
}
