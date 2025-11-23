# Deployment Checklist: Vercel + Supabase Staging

This checklist helps you track the deployment process step-by-step.

## Pre-Deployment Setup

### Step 1: Create Supabase Project
- [ ] Go to https://supabase.com/dashboard
- [ ] Click "New Project"
- [ ] Enter project details:
  - Name: `calorie-smart-staging`
  - Database Password: (generate strong password)
  - Region: (choose closest to your users)
- [ ] Wait for project provisioning (~2 minutes)
- [ ] Navigate to Project Settings → Database
- [ ] Copy connection string (use **Connection Pooling** mode)
- [ ] Replace `[YOUR-PASSWORD]` in the connection string
- [ ] Save the complete `DATABASE_URL`

**Expected format:**
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 2: Generate NextAuth Secret
- [ ] Run in terminal: `openssl rand -base64 32`
- [ ] Copy the output for `NEXTAUTH_SECRET`

### Step 3: Obtain USDA API Key (Optional)
- [ ] Visit https://fdc.nal.usda.gov/api-key-signup.html
- [ ] Sign up for a free API key
- [ ] Copy the key for `FDC_API_KEY`

## Vercel Project Setup

### Step 4: Create/Import Vercel Project
- [ ] Go to https://vercel.com/new
- [ ] Import your GitHub repository
- [ ] Select the repository: `calorie-smart-mvp`
- [ ] Configure project settings:
  - Framework Preset: Next.js (auto-detected)
  - Root Directory: `.` (default)
  - Build Command: `pnpm build` (default from package.json)
  - Install Command: `pnpm install` (default)

### Step 5: Configure Environment Variables
Go to Vercel Project Settings → Environment Variables and add:

- [ ] `DATABASE_URL`
  - Value: (Supabase connection string from Step 1)
  - Environments: Production, Preview

- [ ] `NEXTAUTH_SECRET`
  - Value: (Generated value from Step 2)
  - Environments: Production, Preview

- [ ] `NEXTAUTH_URL`
  - Value: `https://calorie-smart-staging.vercel.app` (or your Vercel domain)
  - Environments: Production, Preview
  - Note: Update after first deployment if domain differs

- [ ] `FDC_API_KEY` (Optional)
  - Value: (USDA API key from Step 3)
  - Environments: Production, Preview

- [ ] `NODE_ENV`
  - Value: `production`
  - Environments: Production, Preview

## Deployment

### Step 6: Initial Deployment
- [ ] Click "Deploy" in Vercel dashboard
- [ ] Wait for deployment to complete (~2-3 minutes)
- [ ] Check build logs for any errors
- [ ] Verify deployment succeeded

### Step 7: Update NEXTAUTH_URL (if needed)
- [ ] Copy the actual deployed URL from Vercel
- [ ] If different from placeholder, update `NEXTAUTH_URL` in environment variables
- [ ] Redeploy: Deployments → ... → Redeploy

## Verification

### Step 8: Test Authentication Flows
Visit your staging URL and test:

- [ ] **Sign Up**: Create a new account with email/password
- [ ] **Sign Out**: Verify logout works correctly
- [ ] **Sign In**: Log back in with created credentials
- [ ] **Protected Routes**: Verify redirect to /signin when not authenticated

### Step 9: Test Onboarding Flow
- [ ] Complete onboarding form with profile details:
  - Age, gender, height, weight
  - Activity level
  - Weight goal (lose, maintain, gain)
- [ ] Verify calorie target is calculated and displayed
- [ ] Confirm redirect to dashboard after completion

### Step 10: Test Dashboard Features
- [ ] **Add Food Entry**: Create a new food log with name, calories, meal type
- [ ] **View Daily Summary**: Check total calories and progress bar update
- [ ] **Edit Food Entry**: Modify an existing entry
- [ ] **Delete Food Entry**: Remove an entry and verify total updates
- [ ] **Date Navigation**: Switch to different dates and verify correct data loads

### Step 11: Test History Page
- [ ] Navigate to 7-day history page
- [ ] Verify sparkline chart renders correctly
- [ ] Check daily totals are accurate
- [ ] Verify variance vs target is calculated correctly
- [ ] Confirm entries are grouped by day

### Step 12: Test Food Search (if FDC_API_KEY configured)
- [ ] Navigate to food search page
- [ ] Search for common foods (e.g., "apple", "chicken", "rice")
- [ ] Verify results load from USDA database
- [ ] Quick-add a food item from search results
- [ ] Confirm item appears on dashboard with correct calories

### Step 13: Test Error Handling
- [ ] Try signing in with incorrect credentials
- [ ] Try accessing protected routes without authentication
- [ ] Test form validation on onboarding page
- [ ] Test empty search queries
- [ ] Verify friendly error messages display

## Documentation Updates

### Step 14: Update README
- [ ] Verify staging URL is correct in README.md
- [ ] Confirm deployment section is accurate
- [ ] Add any deployment notes or gotchas discovered

### Step 15: Document Deployment
- [ ] Update STAGING_DEPLOYMENT_NOTES.md with:
  - Deployment date
  - Deployed by (your name)
  - Verification status
  - Any issues encountered and resolutions

### Step 16: Notify Team
- [ ] Post staging URL in PR or team chat
- [ ] Share verification results
- [ ] Note any known issues or limitations

## Post-Deployment

### Step 17: Enable Monitoring (Optional)
- [ ] Enable Vercel Analytics in project settings
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure uptime monitoring (UptimeRobot, etc.)

### Step 18: Configure Preview Deployments
- [ ] Go to Settings → Git
- [ ] Set production branch to `main`
- [ ] Configure preview deployments for all branches/PRs
- [ ] Test preview deployment with a sample PR

### Step 19: Plan Production Deployment
- [ ] Review staging performance and issues
- [ ] Plan production environment setup
- [ ] Consider custom domain setup
- [ ] Review scaling and monitoring needs

## Troubleshooting Reference

### Build Failures
- **Prisma migration errors**: Check DATABASE_URL is set and Supabase is active
- **Type errors**: Run `pnpm typecheck` locally first
- **Dependency errors**: Ensure all deps are in package.json

### Runtime Errors
- **NextAuth errors**: Verify NEXTAUTH_URL matches domain exactly (no trailing slash)
- **Database connection issues**: Ensure Supabase project is active (not paused)
- **API errors**: Check Vercel function logs in deployment details

### Need Help?
- See DEPLOYMENT.md for detailed troubleshooting
- Check Vercel deployment logs
- Review Supabase dashboard for database issues

---

## Quick Reference: Environment Variables

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | `postgresql://postgres.xxxxx:...` | Supabase Project Settings → Database |
| `NEXTAUTH_SECRET` | (random 32+ char string) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://calorie-smart-staging.vercel.app` | Vercel deployment URL |
| `FDC_API_KEY` | (API key string) | https://fdc.nal.usda.gov/api-key-signup.html |
| `NODE_ENV` | `production` | Manual entry |

---

**Deployment Status:** ⏳ Pending / ✅ Complete / ❌ Failed
**Deployment Date:** _____________
**Deployed By:** _____________
**Verified By:** _____________
