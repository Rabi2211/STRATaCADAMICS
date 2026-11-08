# STRATA app (React + TypeScript + Vite)

## Local setup

```bash
npm install
npm --prefix server install
```

### Firebase setup

1. Create a Firebase project in the Firebase console.
2. Enable Authentication with Email/Password sign-in.
3. Copy the values from your Firebase project settings into the app environment file:

```bash
cp strata-app/.env.example strata-app/.env
```

Update the values in `strata-app/.env` to match your actual Firebase app config.

### PostgreSQL setup

Option A: run PostgreSQL in Docker

```bash
npm run db:up
```

This starts a local Postgres instance using the config in `docker-compose.yml`.

Option B: use a local Postgres install

1. Start a local PostgreSQL instance and create a database named `strata`.
2. Verify the server env file matches your local database connection:

```bash
cat server/.env
```

Default example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/strata"
```

3. Sync the Prisma schema to the database:

```bash
npm --prefix server run db:push
```

### Run the app

```bash
npm run dev
npm --prefix server run dev
```

Open `/pages` for an index of every page.

- `src/components` – DashboardLayout, StoreLayout, StoreHeader, StoreFooter
- `src/pages/<area>/<Page>.tsx` + `<Page>.css` – one component and one stylesheet per page
- `src/styles` – shared dashboard and storefront styles (scoped under `.dash` / `.sf`)
- `src/data` – navigation and storefront data
