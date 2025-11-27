# PR #7 - Deploy MVP to Vercel + Supabase (Staging)

## Summary

This PR configures the Calorie Smart MVP for deployment to a staging environment on Vercel with Supabase Postgres. All deployment configuration files and documentation have been added to enable smooth deployment and verification.

## Changes Made

### 1. Build Configuration (`package.json`)
- **Added `postinstall` script**: Automatically generates Prisma client after dependency installation
- **Updated `build` script**: Runs `prisma migrate deploy` before Next.js build to ensure database schema is up-to-date
- **Added `prisma:deploy` script**: Provides manual migration deployment option

### 2. Database Migrations
- **Created initial migration** (`prisma/migrations/20231122160000_initial/`): Captures the current schema state
- **Added migration lock file** (`prisma/migrations/migration_lock.toml`): Ensures PostgreSQL provider consistency
- Migrations will be automatically applied during Vercel builds

### 3. Environment Configuration (`.env.example`)
- Updated with clearer structure and deployment notes
- Added guidance for Supabase connection strings
- Clarified required vs optional environment variables
- Included instructions for staging/production configuration

### 4. Deployment Documentation
- **`DEPLOYMENT.md`**: Comprehensive step-by-step deployment guide with:
  - Supabase project setup instructions
  - Vercel environment variable configuration
  - Deployment verification checklist
  - Troubleshooting section
- **`STAGING_DEPLOYMENT_NOTES.md`**: Quick reference for PR #7 with deployment status and verification checklist
- **`README.md`**: Updated with deployment section and staging URL

### 5. Vercel Configuration
- **Created `vercel.json`**: Optimizes deployment settings for Vercel platform
- Specifies build and install commands explicitly
- Configures Next.js framework detection
- Sets deployment region preference

## Environment Variables Required

Set these in Vercel Project Settings → Environment Variables (apply to both Production and Preview):

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Supabase Postgres connection string with pgbouncer |
| `NEXTAUTH_URL` | ✅ | Deployed domain URL (e.g., `https://calorie-smart-staging.vercel.app`) |
| `NEXTAUTH_SECRET` | ✅ | Random 32+ character string (generate with `openssl rand -base64 32`) |
| `FDC_API_KEY` | ❌ | USDA FoodData Central API key (enables food search) |
| `NODE_ENV` | ✅ | Set to `production` |

## Deployment Steps

1. **Set up Supabase**
   - Create new project at https://supabase.com
   - Copy connection string (use Connection Pooling mode)

2. **Configure Vercel**
   - Import GitHub repository to Vercel
   - Add environment variables listed above
   - Deploy (automatic on merge to main)

3. **Verify Deployment**
   - Test authentication flows (sign up, sign in, sign out)
   - Complete onboarding and verify calorie calculation
   - Test food entry CRUD operations
   - Verify 7-day history with sparkline
   - Test USDA food search (if API key configured)

## Staging URL

**https://calorie-smart-staging.vercel.app**

This URL will be live after:
1. Supabase project is created
2. Environment variables are configured in Vercel
3. This PR is deployed

### Demo Credentials

For smoke testing, use the seeded demo user:
- **Email:** `demo@example.com`
- **Password:** `password123`

Or create a new account to test the full sign-up flow.

### Smoke Test Instructions

See [SMOKE_TEST.md](./SMOKE_TEST.md) for comprehensive testing instructions.

**Quick Smoke Test:**
1. Visit the staging URL and verify it loads (not 404)
2. Sign in with demo credentials or create a new account
3. Complete onboarding to generate a personalized calorie target
4. On the dashboard: add, edit, and delete a food entry
5. Verify the progress ring updates after each action
6. Navigate to the 7-day history page and verify the chart renders
7. Test USDA search (if `FDC_API_KEY` is configured)

## Files Changed

- `.env.example` - Updated with deployment notes
- `README.md` - Added deployment section and staging URL
- `package.json` - Added deployment scripts

## Files Added

- `DEPLOYMENT.md` - Comprehensive deployment guide
- `STAGING_DEPLOYMENT_NOTES.md` - Quick reference for this PR
- `SMOKE_TEST.md` - Detailed staging smoke test checklist
- `SMOKE_TEST_SUMMARY.md` - Quick-reference status template for PR updates
- `scripts/verify-env.sh` - Helper script to validate required environment variables
- `vercel.json` - Vercel configuration
- `prisma/migrations/20231122160000_initial/migration.sql` - Initial database migration
- `prisma/migrations/migration_lock.toml` - Migration provider lock

## Testing

- ✅ TypeScript type checking passes
- ✅ Prisma client generates successfully
- ✅ Migration files are valid and properly formatted
- ⏳ Deployment verification pending (will be done after merge)

### Smoke Test Status

**Current Status (2025-11-27):** ⚠️ Blocked - Deployment not accessible

The staging URL currently returns `DEPLOYMENT_NOT_FOUND`. Before smoke testing can begin:

1. ✅ Smoke test documentation created ([SMOKE_TEST.md](./SMOKE_TEST.md))
2. ✅ Quick reference guide created ([SMOKE_TEST_SUMMARY.md](./SMOKE_TEST_SUMMARY.md))
3. ✅ Environment verification script added (`scripts/verify-env.sh`)
4. ⏳ Pending: Vercel deployment must be created and environment variables configured
5. ⏳ Pending: Database must be seeded with demo user
6. ⏳ Pending: Execute smoke test and post results

**Next tester:** Please follow the instructions in [SMOKE_TEST_SUMMARY.md](./SMOKE_TEST_SUMMARY.md) and post results using the provided template.

## Next Steps

1. Create Supabase project and obtain `DATABASE_URL`
2. Generate `NEXTAUTH_SECRET` using `openssl rand -base64 32`
3. Add environment variables to Vercel
4. Deploy to staging
5. Run verification checklist from `DEPLOYMENT.md`
6. Update this PR with deployment status and any issues encountered

## Notes

- The `postinstall` hook ensures Prisma client is always generated after installing dependencies
- The build command runs migrations automatically, so no manual migration step is needed
- Supabase connection pooling (`?pgbouncer=true`) is recommended for optimal serverless performance
- Preview deployments will be automatically created for all PRs going forward

## Questions or Issues?

See `DEPLOYMENT.md` for detailed troubleshooting steps or reach out to the team.
