# Calorie Smart MVP

Calorie Smart is a full-stack calorie tracking application built with Next.js 14 (App Router), TypeScript, Prisma, and NextAuth. The MVP integrates all feature branches into a single experience:

- Email/password authentication with protected routes
- Guided onboarding to capture profile details and calculate calorie targets
- Food logging with CRUD actions and daily dashboard summary
- 7-day history view with visual sparkline and variance vs target
- Optional USDA FoodData Central search integration for faster logging

## Live Demo

**Staging Environment:** https://calorie-smart-staging.vercel.app

### Quick Smoke Test (Staging)

Use the flow below to sanity-check the staging deployment:

1. Open the staging URL above (ensure the page loads without a Vercel `DEPLOYMENT_NOT_FOUND` error).
2. Sign up for a new account or sign in with the seeded demo user (`demo@example.com` / `password123`).
3. Complete the onboarding questionnaire to generate the personalized calorie target.
4. On the dashboard, add a food entry, edit it, and then delete it—confirm that the progress ring updates after each action.
5. Navigate to the 7-day history page from the sidebar and verify the chart renders with the new entry reflected.
6. Click **Add Food** and search the USDA database (requires an `FDC_API_KEY`; if the key is missing the modal will display a helpful empty state).

If any step fails, record the behavior and open a follow-up ticket with screenshots or console errors if possible. A comprehensive checklist is available in [SMOKE_TEST.md](./SMOKE_TEST.md).

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
