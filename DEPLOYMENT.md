# Deployment Guide: Staging Environment (Vercel + Supabase)

This guide walks you through deploying the Calorie Smart MVP to a staging environment on Vercel with Supabase Postgres.

## Prerequisites

- GitHub repository with the project
- [Vercel](https://vercel.com) account
- [Supabase](https://supabase.com) account
- [USDA FoodData Central API key](https://fdc.nal.usda.gov/api-key-signup.html) (optional)

## Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - **Name**: calorie-smart-staging (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
4. Click "Create new project" and wait for it to provision (~2 minutes)
5. Once ready, go to **Project Settings** → **Database**
6. Under "Connection string", select **Connection pooling** (recommended for serverless)
7. Copy the URI and replace `[YOUR-PASSWORD]` with your actual database password
8. Your connection string should look like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

## Step 2: Generate NextAuth Secret

Run this command in your terminal to generate a secure random string:

```bash
openssl rand -base64 32
```

Save this value - you'll need it for the `NEXTAUTH_SECRET` environment variable.

## Step 3: Set up Vercel Project

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: Leave as default
   - **Build Command**: Leave as default (uses `pnpm build` from package.json)
   - **Install Command**: Leave as default (uses `pnpm install`)

## Step 4: Configure Environment Variables

Before deploying, add these environment variables in Vercel:

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable          | Value                                                      | Environment       |
|-------------------|------------------------------------------------------------|--------------------|
| `DATABASE_URL`    | Your Supabase connection string from Step 1                | Production, Preview |
| `NEXTAUTH_URL`    | Your Vercel project URL (e.g., `https://calorie-smart-staging.vercel.app`) | Production, Preview |
| `NEXTAUTH_SECRET` | The random string generated in Step 2                      | Production, Preview |
| `FDC_API_KEY`     | Your USDA FoodData Central API key (optional)              | Production, Preview |
| `NODE_ENV`        | `production`                                               | Production, Preview |

**Important**: 
- Apply variables to both "Production" and "Preview" environments
- For `NEXTAUTH_URL`, use your actual Vercel deployment URL (you can update this after the first deployment)

## Step 5: Deploy

1. Click **Deploy** in Vercel
2. Vercel will:
   - Clone your repository
   - Install dependencies with `pnpm install`
   - Run `postinstall` hook to generate Prisma client
   - Execute `prisma migrate deploy` to apply database migrations
   - Build the Next.js application
   - Deploy to production

3. Wait for the deployment to complete (~2-3 minutes)

## Step 6: Update NEXTAUTH_URL (if needed)

If you used a placeholder for `NEXTAUTH_URL`:

1. Copy your deployed URL from Vercel (e.g., `https://calorie-smart-staging.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` with the actual URL
4. Trigger a redeployment: **Deployments** → **...** → **Redeploy**

## Step 7: Verify Deployment

Visit your staging URL and test these flows:

### Authentication
- [ ] Sign up with a new email/password
- [ ] Sign out
- [ ] Sign in with the created account
- [ ] Verify protected routes redirect to sign-in

### Onboarding
- [ ] Complete the onboarding form with profile details
- [ ] Verify calorie target is calculated correctly
- [ ] Submit and see the dashboard

### Dashboard
- [ ] Add a new food entry
- [ ] View daily calorie total and progress bar
- [ ] Edit an existing food entry
- [ ] Delete a food entry
- [ ] Verify daily total updates correctly

### History
- [ ] Navigate to 7-day history page
- [ ] Verify sparkline chart renders
- [ ] Check daily totals and variance vs target
- [ ] View entries grouped by day

### Food Search (if FDC_API_KEY configured)
- [ ] Navigate to food search page
- [ ] Search for a food item (e.g., "apple")
- [ ] Verify results load from USDA database
- [ ] Quick-add a food item from search
- [ ] Confirm it appears on dashboard

## Step 8: Enable Preview Deployments

Preview deployments are enabled by default for all branches and pull requests.

To customize:
1. Go to **Settings** → **Git**
2. Configure:
   - **Production Branch**: `main` (or your default branch)
   - **Preview Deployments**: Enable for all branches or specific branches

## Step 9: Update Documentation

1. Update the staging URL in `README.md`:
   ```markdown
   **Staging Environment:** https://your-actual-vercel-url.vercel.app
   ```

2. If using GitHub, add the staging URL to PR #7 as a comment

3. Commit and push the README update

## Troubleshooting

### Build Failures

**Prisma migration errors:**
- Check that `DATABASE_URL` is correctly set
- Ensure Supabase project is active and accessible
- Verify the connection string uses connection pooling (`?pgbouncer=true`)

**Type errors:**
- Run `pnpm typecheck` locally to catch issues before deploying
- Ensure all dependencies are listed in `package.json`

**Out of memory:**
- Upgrade your Vercel plan if needed
- Check for large bundle sizes

### Runtime Errors

**NextAuth errors:**
- Verify `NEXTAUTH_URL` matches your deployed domain exactly
- Check that `NEXTAUTH_SECRET` is set and at least 32 characters
- Ensure no trailing slashes in `NEXTAUTH_URL`

**Database connection issues:**
- Use connection pooling mode in Supabase (pgbouncer)
- Check that Supabase project is not paused (free tier pauses after inactivity)
- Verify firewall rules allow Vercel's IP ranges

**API errors:**
- Check Vercel function logs: **Deployments** → Select deployment → **Functions** tab
- Enable logging in your API routes for debugging

## Monitoring

- **Vercel Analytics**: Enable in project settings for performance insights
- **Supabase Dashboard**: Monitor database usage, queries, and performance
- **Vercel Logs**: View real-time function logs and errors

## Next Steps

- Set up custom domain (if needed)
- Configure Vercel Analytics for usage tracking
- Set up error monitoring (Sentry, LogRocket, etc.)
- Add status page monitoring (UptimeRobot, etc.)
- Plan for production deployment after staging verification
