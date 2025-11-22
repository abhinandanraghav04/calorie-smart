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

## Files Changed

- `.env.example` - Updated with deployment notes
- `README.md` - Added deployment section and staging URL
- `package.json` - Added deployment scripts

## Files Added

- `DEPLOYMENT.md` - Comprehensive deployment guide
- `STAGING_DEPLOYMENT_NOTES.md` - Quick reference for this PR
- `vercel.json` - Vercel configuration
- `prisma/migrations/20231122160000_initial/migration.sql` - Initial database migration
- `prisma/migrations/migration_lock.toml` - Migration provider lock

## Testing

- ✅ TypeScript type checking passes
- ✅ Prisma client generates successfully
- ✅ Migration files are valid and properly formatted
- ⏳ Deployment verification pending (will be done after merge)

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
