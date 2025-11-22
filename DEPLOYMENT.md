# Deployment Guide: Vercel + Supabase

This guide walks you through deploying the Calorie Smart MVP to Vercel with Supabase as the PostgreSQL database provider.

## Prerequisites

- A [Vercel](https://vercel.com) account
- A [Supabase](https://supabase.com) account
- A [USDA FoodData Central API key](https://fdc.nal.usda.gov/api-key-signup.html)
- Git repository connected to your Vercel project

## 1. Supabase Setup

### 1.1 Create a New Project

1. Log in to [Supabase](https://supabase.com)
2. Click **New Project**
3. Choose your organization
4. Enter project details:
   - **Name**: `calorie-smart-mvp` (or your preferred name)
   - **Database Password**: Generate a strong password (save this securely!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for MVP
5. Click **Create new project**
6. Wait for the project to finish provisioning (this may take a few minutes)

### 1.2 Get Database Connection Strings

Once your project is ready:

1. Navigate to **Settings** → **Database**
2. Scroll to **Connection string** section
3. You'll need TWO connection strings:

#### Pooled Connection (DATABASE_URL)
- Select **Connection Pooling** → **Transaction mode**
- Copy the connection string (it will look like):
  ```
  postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true
  ```
- Add `&connection_limit=1` to the end for optimal Prisma performance:
  ```
  postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
  ```

#### Direct Connection (DATABASE_DIRECT_URL)
- Select **Connection string** → **URI**
- Copy the connection string (it will look like):
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
  ```
- This is used for running migrations

**Important**: Replace `[YOUR-PASSWORD]` with your actual database password in both URLs.

## 2. Vercel Setup

### 2.1 Create a New Project

1. Log in to [Vercel](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your Git repository
4. Configure project settings:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `pnpm build` (default)
   - **Install Command**: `pnpm install` (default)

### 2.2 Configure Environment Variables

Before deploying, add the following environment variables in Vercel:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | Your Supabase pooled connection string | Production, Preview, Development |
| `DATABASE_DIRECT_URL` | Your Supabase direct connection string | Production, Preview, Development |
| `NEXTAUTH_URL` | Your production URL (e.g., `https://your-app.vercel.app`) | Production |
| `NEXTAUTH_URL` | Auto-generated preview URL | Preview |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` | Production, Preview, Development |
| `FDC_API_KEY` | Your USDA FoodData Central API key | Production, Preview, Development |

**Tips:**
- For `NEXTAUTH_URL` in Preview environments, you can use Vercel's automatic environment variable: `https://$VERCEL_URL`
- For `NEXTAUTH_SECRET`, generate a secure random string using: `openssl rand -base64 32`
- Keep different secrets for Production and Preview environments

**Alternative: CLI Setup**

If you prefer using the Vercel CLI, you can use the provided setup script:

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Run the setup script
./scripts/setup-vercel-env.sh
```

This interactive script will prompt you for all required environment variables and configure them automatically.

### 2.3 Deploy

1. Click **Deploy** to start your first deployment
2. Vercel will:
   - Install dependencies with `pnpm install`
   - Generate Prisma client (via `postinstall` hook)
   - Run database migrations (via `build` script)
   - Build the Next.js application
   - Deploy to production

3. Monitor the build logs for any errors

## 3. Initial Deployment

### 3.1 First Deployment

The first deployment will:
1. Run `prisma generate` to create the Prisma client
2. Run `prisma migrate deploy` to apply database migrations
3. Build the Next.js application

Check the deployment logs to ensure migrations ran successfully. You should see:
```
✓ Running prisma generate
✓ Running prisma migrate deploy
✓ 1 migration found in prisma/migrations
✓ Migration `20240101000000_init` applied successfully
```

### 3.2 Verify Deployment

1. Once deployment completes, visit your production URL
2. Navigate to `/signup` to create a new account
3. Sign in and access the dashboard to verify everything works

## 4. Preview Environments

Vercel automatically creates preview deployments for every push to non-production branches.

### 4.1 Preview Configuration

Preview environments will:
- Use the same Supabase database as production (shared DATABASE_URL)
- Have separate `NEXTAUTH_URL` values (auto-generated per preview)
- Run migrations automatically on each deployment

**Note**: For production apps, consider using separate Supabase projects for staging/preview environments.

### 4.2 Staging Environment Setup

To create a dedicated staging environment:

1. Create a new Supabase project for staging (follow step 1)
2. In Vercel, go to **Settings** → **Git**
3. Set your **Production Branch** to `main`
4. Create a `staging` branch in your repository
5. Add staging-specific environment variables:
   - Go to **Settings** → **Environment Variables**
   - Edit existing variables and uncheck "Production"
   - Add new variables with staging values, only checked for "Preview"
   - Or use Vercel's branch-specific environment variables for the `staging` branch

## 5. Database Management

### 5.1 Running Migrations

Migrations run automatically during the build process. To manually run migrations:

```bash
# From your local machine (ensure DATABASE_DIRECT_URL is set)
pnpm prisma:migrate:deploy
```

### 5.2 Creating New Migrations

When you update your Prisma schema:

```bash
# Local development
pnpm prisma:migrate

# This creates a new migration file
# Commit the migration file to Git
# Push to deploy - migrations run automatically on Vercel
```

### 5.3 Database Access

To access your Supabase database:

1. **Via Supabase Dashboard**: 
   - Go to your project → **Table Editor**
   - Or use **SQL Editor** for custom queries

2. **Via Prisma Studio** (local):
   ```bash
   npx prisma studio
   ```

3. **Via psql** (command line):
   ```bash
   psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
   ```

## 6. Monitoring & Debugging

### 6.1 Vercel Logs

- Go to your deployment → **Logs** tab
- Check **Build Logs** for migration issues
- Check **Function Logs** for runtime errors

### 6.2 Common Issues

**Migration fails during deployment:**
- Ensure `DATABASE_DIRECT_URL` is set correctly
- Check that your Supabase database is accessible
- Verify the connection string includes the password

**"PrismaClient is unable to run in the browser":**
- This should not happen with the current setup
- If it does, ensure you're not importing Prisma client in client components

**Connection timeout errors:**
- Check Supabase project status (it may be paused on free tier)
- Verify your connection strings are correct
- Ensure `connection_limit=1` is set in `DATABASE_URL`

**NextAuth errors:**
- Verify `NEXTAUTH_URL` matches your deployment URL
- Ensure `NEXTAUTH_SECRET` is set and identical across all function instances

## 7. Production Checklist

Before going to production, ensure:

- [ ] All environment variables are set correctly
- [ ] `NEXTAUTH_SECRET` is a strong, random value
- [ ] Database migrations have run successfully
- [ ] SSL is enabled (Vercel handles this automatically)
- [ ] Sign up, sign in, and protected routes work correctly
- [ ] Dashboard loads without errors
- [ ] You can sign out successfully
- [ ] Supabase database connection is stable
- [ ] FDC API key is valid and working

## 8. Live URLs

### Production
- **URL**: https://your-app.vercel.app *(Update with your actual production URL)*
- **Branch**: `main`

### Staging
- **URL**: https://your-app-staging.vercel.app *(Update with your actual staging URL)*
- **Branch**: `staging` *(Configure as needed)*

### Preview
- **URL**: Auto-generated per PR/branch
- **Pattern**: `https://calorie-smart-mvp-{git-branch}-{team-slug}.vercel.app`

## 9. Maintenance

### 9.1 Updating Dependencies

```bash
pnpm update
```

Commit changes and push to deploy updates.

### 9.2 Database Backups

Supabase provides:
- **Automatic daily backups** (7 days retention on free tier)
- Access backups via **Database** → **Backups** in Supabase dashboard

### 9.3 Scaling

As your app grows:
- Monitor database usage in Supabase dashboard
- Consider upgrading Supabase plan for better performance
- Use Vercel Analytics to monitor application performance
- Enable Vercel Pro for additional features

## 10. Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

---

**Questions or issues?** Check the troubleshooting section or consult the documentation links above.
