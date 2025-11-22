# Staging Deployment - PR #7

## Deployment Status

**Staging URL:** https://calorie-smart-staging.vercel.app

## What's Been Configured

### Repository Changes

1. **Build Configuration** (`package.json`)
   - Added `postinstall` script to auto-generate Prisma client
   - Updated `build` command to run `prisma migrate deploy` before building
   - Added `prisma:deploy` script for manual migration deployments

2. **Environment Configuration** (`.env.example`)
   - Updated with clear deployment notes
   - Added context for required vs optional variables
   - Included Supabase connection string guidance

3. **Documentation**
   - Added comprehensive `DEPLOYMENT.md` guide with step-by-step instructions
   - Updated `README.md` with deployment section and staging URL
   - Created `vercel.json` for optimal Vercel configuration

4. **Database Migrations**
   - Created initial Prisma migration (`prisma/migrations/20231122160000_initial/`)
   - Added `migration_lock.toml` to ensure consistent provider (PostgreSQL)
   - Migrations will auto-deploy during Vercel builds

### Required Environment Variables (Vercel)

Set these in Vercel Project Settings → Environment Variables:

| Variable          | Description                                    | Required |
|-------------------|------------------------------------------------|----------|
| `DATABASE_URL`    | Supabase Postgres connection string            | ✅ Yes   |
| `NEXTAUTH_URL`    | Deployed domain URL                            | ✅ Yes   |
| `NEXTAUTH_SECRET` | Random 32+ character string (use `openssl rand -base64 32`) | ✅ Yes   |
| `FDC_API_KEY`     | USDA FoodData Central API key                  | ❌ No (optional) |
| `NODE_ENV`        | Set to `production`                            | ✅ Yes   |

### Deployment Verification Checklist

After deployment, verify these features work:

- [ ] **Authentication**: Sign up, sign in, sign out
- [ ] **Onboarding**: Complete profile form and view calculated calorie target
- [ ] **Dashboard**: Add, edit, delete food entries; view daily totals
- [ ] **History**: View 7-day history with sparkline chart
- [ ] **Food Search**: Search USDA database (if API key configured)

## Next Steps

1. **Set up Supabase**
   - Create project at https://supabase.com
   - Get connection string from Project Settings → Database
   - Use connection pooling mode (`?pgbouncer=true`)

2. **Configure Vercel**
   - Import GitHub repo to Vercel
   - Add environment variables listed above
   - Deploy

3. **Verify & Test**
   - Follow verification checklist
   - Test all primary user flows
   - Confirm migrations applied successfully

4. **Update Documentation**
   - Replace placeholder URLs with actual staging URL
   - Add any lessons learned or gotchas

## Support Resources

- [Deployment Guide](./DEPLOYMENT.md) - Full step-by-step instructions
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment/deploy-to-vercel)

## Troubleshooting

### Build fails with Prisma errors
- Ensure `DATABASE_URL` is set correctly in Vercel
- Check that Supabase project is active (not paused)
- Verify connection string uses connection pooling

### NextAuth errors after deployment
- Confirm `NEXTAUTH_URL` matches deployed domain exactly (no trailing slash)
- Verify `NEXTAUTH_SECRET` is set and at least 32 characters
- Check that cookies are not blocked in browser

### Database connection issues
- Use Supabase connection pooling (pgbouncer) for serverless
- Verify Supabase project has not paused (free tier auto-pauses)
- Check that DATABASE_URL includes `?pgbouncer=true` parameter

---

**Deployed:** [Add deployment date here]
**Deployed By:** [Add deployer name here]
**Verified:** [Add verification date/name here]
