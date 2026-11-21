# STRATA app (React + TypeScript + Vite)

## Local setup

```bash
npm install
npm --prefix server install
```

### South African payment setup

This storefront supports OZOW and Peach Payments as checkout providers. Add the provider details to your environment before enabling redirect checkout:

```bash
cp .env.example .env
```

Example values:

```env
VITE_OZOW_MERCHANT_ID=your_ozow_merchant_id
VITE_OZOW_API_KEY=your_ozow_api_key
VITE_PEACH_PUBLIC_KEY=your_peach_public_key
VITE_PEACH_BASE_URL=https://sandbox.peachpayments.com
VITE_BOP_MERCHANT_ID=your_bop_merchant_id
VITE_BOP_API_KEY=your_bop_api_key
VITE_BOP_BASE_URL=https://sandbox.boppay.co.za
VITE_PAYMENT_MODE=sandbox
```

If those values are not configured, the app will still run in demo mode and show the secure redirect flow without completing a live payment.

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

### Newsletter setup

The storefront exposes these Firebase Functions endpoints:

- `POST /api/newsletter/subscribe` stores normalized, deduplicated subscribers in `newsletterSubscribers`.
- `POST /api/newsletter/send` sends updates through Resend to active subscribers. This endpoint requires a verified Firebase admin account.

Set the server-side secret in Firebase Functions:

```bash
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set NEWSLETTER_FROM
firebase deploy --only functions,firestore:rules
```

`NEWSLETTER_FROM` is optional and should use a sender/domain verified in Resend. Keep `RESEND_API_KEY` out of `VITE_*` variables and browser code. The email-submission endpoint is public, but subscriber and campaign documents are denied to direct client access by Firestore rules.
