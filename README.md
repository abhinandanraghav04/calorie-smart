# Calorie Smart

A full-stack calorie tracker I built to learn how a real web product fits together end to end: authentication, a relational database, server-side API routes, third-party data and deployment.

**Stack:** Next.js 14 (App Router), TypeScript, PostgreSQL, Prisma, NextAuth, Zod, deployed on Vercel with Supabase.

## What it does

- Email and password sign-up with protected routes (NextAuth, bcrypt-hashed passwords)
- Onboarding that works out a daily calorie target from your profile using the Mifflin-St Jeor formula
- Food logging with create, edit and delete, plus a daily dashboard showing progress against target
- 7-day history with a sparkline and variance from target
- Optional food search backed by the USDA FoodData Central API

## What I focused on

- A clean Prisma schema and migrations so the database can be rebuilt from migrations and seeded with demo data
- Validating input with Zod on the server rather than trusting the client
- Keeping secrets out of the repo: everything is configured through environment variables (see `.env.example`)

## Live Demo

**Staging Environment:** https://calorie-smart-staging.vercel.app

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [pnpm](https://pnpm.io/) 8 or later
- A PostgreSQL database (local or hosted)
- (Optional) USDA FoodData Central API key for food search

### Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Required values:

- `DATABASE_URL` – PostgreSQL connection string
- `NEXTAUTH_URL` – Base URL for NextAuth callbacks (set to your deployed domain in staging/production)
- `NEXTAUTH_SECRET` – Secret string used to sign NextAuth JWTs

Optional:

- `FDC_API_KEY` – USDA FoodData Central API key (enables food search page)

### Install & Run

Install dependencies and set up the database:

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
```

Seed demo data (optional):

```bash
pnpm prisma:seed
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Flow

1. Sign up for a new account or sign in with the seeded demo user (`demo@example.com` / `password123`).
2. Complete the onboarding form. Calorie targets are computed with the Mifflin-St. Jeor formula based on your profile and goal.
3. Visit the dashboard to log meals, view daily progress, and jump to add new entries.
4. Explore the 7-day history page for trends and target variance.
5. Use the food search page (if configured) to pull calorie data directly from USDA FoodData Central.

## Project Structure

- `app/` – App Router routes, including API endpoints under `app/api`
- `components/` – Reusable client components (navigation, onboarding, food logging, etc.)
- `lib/` – Shared utilities (Prisma client, auth helpers, calorie calculator, USDA client)
- `prisma/` – Prisma schema and seed scripts

## Scripts

- `pnpm dev` – Run the development server
- `pnpm build` – Create a production build (runs Prisma migrations before building)
- `pnpm prisma:deploy` – Apply database migrations to the target environment
- `pnpm start` – Run the production build
- `pnpm lint` – Lint with ESLint
- `pnpm typecheck` – TypeScript type checking
- `pnpm prisma:generate` – Generate Prisma client
- `pnpm prisma:migrate` – Apply database migrations
- `pnpm prisma:seed` – Seed demo data

## Deployment

For a step-by-step checklist, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Vercel + Supabase

This project is configured for deployment on Vercel with a Supabase Postgres database.

#### 1. Set up Supabase

1. Create a new project at [https://supabase.com](https://supabase.com)
2. Navigate to Project Settings → Database
3. Copy the connection string (in "Connection Pooling" mode recommended for serverless)
4. The format should be: `postgresql://[user]:[password]@[host]:[port]/[database]?pgbouncer=true`

#### 2. Configure Vercel

1. Import your GitHub repository to Vercel
2. Set the following environment variables in your Vercel project settings:
   - `DATABASE_URL` – Your Supabase Postgres connection string
   - `NEXTAUTH_URL` – Your deployed domain (e.g., `https://calorie-smart-staging.vercel.app`)
   - `NEXTAUTH_SECRET` – Generate with: `openssl rand -base64 32`
   - `FDC_API_KEY` – (Optional) Your USDA FoodData Central API key
   - `NODE_ENV` – Set to `production`
3. The build command is automatically configured in `package.json` to run migrations before building

#### 3. Deploy

1. Push to your main branch or open a PR to trigger a preview deployment
2. Vercel will automatically:
   - Install dependencies (`pnpm install`)
   - Generate Prisma client (`postinstall` hook)
   - Run migrations (`prisma migrate deploy`)
   - Build the Next.js app (`next build`)

#### 4. Verify Deployment

After deployment, verify these flows work:
- Sign up / Sign in
- Complete onboarding form and view calculated calorie target
- Add, edit, and delete food entries on the dashboard
- View 7-day history with sparkline chart
- Search USDA food database (if `FDC_API_KEY` is configured)

## Security & Notes

- Passwords are hashed with bcrypt before storage.
- Prisma schema targets PostgreSQL; update `DATABASE_URL` for other providers.
- Keep `NEXTAUTH_SECRET` and any API keys private in production.
- Use Supabase connection pooling (pgbouncer) for optimal serverless performance.
