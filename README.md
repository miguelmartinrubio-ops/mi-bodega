# Mi Bodega

App React + Vite para gestionar tu bodega personal. Los datos se guardan en [Turso](https://turso.tech) (libSQL / SQLite).

## Configuración de Turso

```bash
# 1. Instalar la CLI y crear la base de datos
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create mi-bodega

# 2. Crear las tablas
turso db shell mi-bodega < db/schema.sql

# 3. Obtener URL y token
turso db show mi-bodega --url
turso db tokens create mi-bodega
```

Copia `.env.example` a `.env.local` y rellena `VITE_TURSO_DATABASE_URL` y `VITE_TURSO_AUTH_TOKEN`.
En el hosting (Vercel, Netlify…) define las mismas variables de entorno.

> ⚠️ El token va incluido en el bundle del navegador, así que cualquiera que abra la app puede
> leer y escribir en la base de datos. Es aceptable para una app personal; si la publicas,
> mueve las consultas a una función serverless y deja el token solo en el servidor.

## Migrar los datos desde Supabase

```bash
SUPABASE_URL=https://yoodyxpvpipyotfsxfsh.supabase.co \
SUPABASE_KEY=<tu service_role key, o la publishable si RLS permite leer> \
TURSO_DATABASE_URL=libsql://mi-bodega-<usuario>.turso.io \
TURSO_AUTH_TOKEN=<token> \
npm run db:migrate
```

El script crea las tablas si no existen y copia `vinos` y `tomas` conservando los ids.
Se puede ejecutar varias veces sin duplicar filas.

## Desarrollo

```bash
npm install
npm run dev
```
