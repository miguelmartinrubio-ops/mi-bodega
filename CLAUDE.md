# Mi Bodega

App personal (en español) para gestionar una bodega de vinos: listado, kanban por estado, línea de tiempo de tomas y control de stock. Escribe la UI y los mensajes al usuario en español.

## Stack

- React 19 + TypeScript + Vite + Tailwind 4, React Router.
- Base de datos: **Turso** (libSQL/SQLite). Se migró desde Supabase; ya no queda código de Supabase.
- Despliegue: **Vercel**, proyecto `mi-bodega` → https://mi-bodega-five.vercel.app. Cada merge a `main` despliega a producción automáticamente.

## Comandos

- `npm run dev` — servidor de desarrollo (necesita `.env.local`, ver abajo)
- `npm run build` — build de producción (solo `vite build`, no hace type-check)
- `npm run lint` — ESLint
- `npx tsc -b` — type-check. El proyecto ya tiene muchos errores de tipos previos (componentes sin tipar, contexto `null`); no introduzcas nuevos, pero no hace falta arreglar los existentes salvo que se pida.

## Estructura

- `src/lib/turso.ts` — cliente libSQL (`@libsql/client/web`), helper `query()` que devuelve filas como objetos, y `VINO_COLUMNS` / `pickVinoFields()` (lista blanca de columnas editables de `vinos`).
- `src/context/WineContext.tsx` — estado global y todas las operaciones de datos (CRUD de vinos y tomas). Úsalo vía `useWineData()`.
- `src/pages/` — `VinosPage` (/), `KanbanPage` (/kanban), `TimelinePage` (/timeline), `StockPage` (/stock). `ChampagnePage` existe pero no está enrutada.
- `src/components/` — `AddModal`, `DetailModal` (edición + tomas), `WineCard`, etc.
- `db/schema.sql` — esquema de la base de datos.
- `scripts/migrate-from-supabase.mjs` — script de la migración inicial desde Supabase (ya ejecutada; solo como referencia).

## Base de datos

Tablas (ver `db/schema.sql`):
- `vinos`: `id` INTEGER autoincrement, `bodega`, `marca`, `tipo`, `grado` REAL, `variedad`, `region`, `precio` (rango de texto, p. ej. `25-40€`), `anadas_probadas`, `anadas_recomendadas`, `comentarios`, `tier` (rating `'1'`–`'5'` como texto), `estado` (columna del kanban, por defecto `sin_clasificar`), `stock` INTEGER.
- `tomas`: `id` TEXT (UUID generado en la app con `crypto.randomUUID()`), `vino_id`, `fecha` (`YYYY-MM-DD`), `lugar`, `created_at`.

Reglas:
- Usa siempre consultas parametrizadas (`?` + `args`), nunca interpoles valores en el SQL.
- Al añadir una columna a `vinos`: `ALTER TABLE` en Turso, actualiza `db/schema.sql` y añádela a `VINO_COLUMNS` en `src/lib/turso.ts` (si no, no se guardará).
- Las claves foráneas de SQLite no se aplican por defecto: al borrar un vino se borran sus tomas explícitamente en un `batch`.
- Los cambios de esquema en producción los ejecuta el usuario a mano en el editor SQL de Turso (Drizzle Studio), una sentencia cada vez. Dale el SQL listo para pegar.

## Variables de entorno

- `VITE_TURSO_DATABASE_URL` = `libsql://mi-bodega-mmartinrub.aws-eu-west-1.turso.io`
- `VITE_TURSO_AUTH_TOKEN` = token de Turso (no está en el repo)

Están configuradas en Vercel (proyecto `mi-bodega`, entorno Production). En local van en `.env.local` (ignorado por git; plantilla en `.env.example`).

⚠️ Al llevar prefijo `VITE_`, el token se incluye en el bundle del navegador y cualquiera puede leerlo. Fue una decisión consciente por ser una app personal. Si se quiere proteger, mover las consultas a funciones serverless de Vercel (`/api`) y usar `TURSO_AUTH_TOKEN` como Secret.

## Flujo de trabajo

- Trabaja en una rama, abre un Pull Request contra `main` y deja que el usuario lo mergee; Vercel publica al hacer merge.
- Antes de proponer cambios, comprueba que `npm run build` y `npm run lint` no empeoran.
- El usuario usa la app sobre todo desde el iPhone (añadida a la pantalla de inicio): cuida el diseño en móvil.
