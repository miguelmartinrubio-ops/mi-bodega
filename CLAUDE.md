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

## Añadir un vino a partir de un link

Cuando el usuario pegue el link de un vino (tienda, bodega, Vivino…) o solo su nombre, y pida añadirlo:

1. **Busca la información.** Si no puedes abrir la página directamente, usa la búsqueda web con el nombre del vino sacado de la URL. Contrasta al menos dos fuentes; si discrepan (grado, % de variedades), dilo y usa la ficha de la bodega o la de la añada que indique el usuario.
2. **Mapea a las columnas de `vinos`:**
   - `marca`: nombre comercial del vino, sin la añada (p. ej. `Pago de Carraovejas`).
   - `bodega`: nombre de la bodega/productor. Antes de inventar una grafía nueva, comprueba si ya existe en la tabla (`SELECT DISTINCT bodega ...`) y reutilízala.
   - `tipo`: uno de `Tinto`, `Blanco`, `Blanco dulce`, `Dulce`, `Dulce PX`, `Generoso`, `Manzanilla`, `Champagne` (los espumosos de Champagne van como `Champagne`).
   - `grado`: número (REAL), p. ej. `14.5`.
   - `variedad`: formato `92% Tinto Fino / 5% Cabernet Sauvignon / 3% Merlot` (el de `src/utils/formatVariedad.ts`). Sin porcentajes si no se conocen.
   - `region`: denominación de origen o región, con el mismo criterio de reutilizar valores existentes (p. ej. `Ribera del Duero`).
   - `precio`: el rango de `PRICE_RANGES` en `src/data/wines.ts` que contenga el precio de venta encontrado.
   - `anadas_probadas`, `anadas_recomendadas`, `tier`, `comentarios`, `estado`, `stock`: son datos personales del usuario, **no los inventes**; pregúntaselos.
3. **Pregunta antes de escribir.** Muestra una tabla con lo que has encontrado (y la fuente) y pregunta en un solo mensaje lo que falte o sea dudoso: añada, si ya lo ha probado (y entonces fecha/lugar de la toma y rating 1–5), estado del kanban (`sin_clasificar`, `quiero_pronto`, `en_lista`, `repetir_pronto`, `repetir_sin_prisa`, `no_repetir`), stock y comentarios. Si el usuario no sabe algo, déjalo en `NULL`.
4. **Inserta.** Si tienes acceso de red a Turso y el token (`TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` o los `VITE_*`), inserta tú con una consulta parametrizada y comprueba el resultado. Si no, entrega una única sentencia SQL lista para pegar en el editor SQL de Turso, con los textos escapados (comillas simples duplicadas) y `NULL` donde no haya dato, y una consulta `SELECT` para verificarlo. Si hay una toma, da una segunda sentencia que use el id recién creado, p. ej. `INSERT INTO tomas (id, vino_id, fecha, lugar) VALUES (lower(hex(randomblob(16))), (SELECT max(id) FROM vinos), '2026-10-15', 'Madrid');`.
5. **Duplicados.** Antes de insertar, avisa si ya parece existir un vino con la misma marca y bodega y pregunta si actualizarlo en vez de crear otro.

Esto no necesita cambios de código ni Pull Request: es solo un alta de datos.
