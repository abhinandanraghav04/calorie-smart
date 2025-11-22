# Calorie Smart MVP

This project is a Next.js application that implements email + password authentication using NextAuth and Prisma. Users can create accounts, sign in, and access protected areas such as the dashboard and settings page.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fcalorie-smart-mvp&env=DATABASE_URL,NEXTAUTH_SECRET,FDC_API_KEY&envDescription=Required%20environment%20variables%20for%20deployment&envLink=https%3A%2F%2Fgithub.com%2Fyour-username%2Fcalorie-smart-mvp%23environment-variables)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [pnpm](https://pnpm.io/) 8 or later
- A PostgreSQL database (local or hosted)

### Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Update the values to match your environment, especially `DATABASE_URL`, `NEXTAUTH_SECRET`, and `FDC_API_KEY`.

### Install Dependencies

```bash
pnpm install
```

### Prisma Setup

Generate the Prisma client and run database migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

> The first migration will create the `users` table defined in `prisma/schema.prisma`.

Seed a demo account (optional):

```bash
pnpm prisma:seed
```

This seeds a demo user using the credentials defined in `.env` (defaults to `demo@example.com` / `password123`).

### Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## 🌐 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Vercel Deploy

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables:
   - `DATABASE_URL`: Supabase PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `FDC_API_KEY`: USDA Food Data Central API key
4. Deploy!

### Required Environment Variables for Production

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="[GENERATED-SECRET]"
FDC_API_KEY="[YOUR-USDA-FDC-API-KEY]"
```

## Authentication Flow

- Users can sign up at `/signup` and sign in at `/signin`.
- Credentials are verified using Prisma and bcrypt password hashing.
- Sessions are JWT-based. The dashboard (`/dashboard`) and settings page (`/settings`) are protected via middleware and server-side checks.
- The navigation bar reflects the authenticated state and provides access to account settings and sign out.

## Project Structure

- `app/` – Next.js App Router pages and API routes
- `components/` – Reusable UI components
- `lib/` – Shared utilities (Prisma client, auth helpers)
- `prisma/` – Prisma schema and seed script
- `scripts/` – Deployment and build scripts

## Available Scripts

- `pnpm dev` – Start the development server
- `pnpm build` – Create a production build
- `pnpm start` – Start the production server
- `pnpm lint` – Run ESLint
- `pnpm typecheck` – Run TypeScript type checking
- `pnpm prisma:generate` – Generate Prisma client
- `pnpm prisma:migrate` – Run Prisma migrations (development)
- `pnpm prisma:migrate:deploy` – Deploy Prisma migrations (production)
- `pnpm prisma:seed` – Seed demo data

## Additional Notes

- Passwords are securely hashed using bcrypt before storage.
- The Prisma schema targets PostgreSQL; update `DATABASE_URL` if you use a different database provider.
- Ensure `NEXTAUTH_SECRET` remains private in production environments.
- The app automatically handles database migrations on Vercel deployment.
