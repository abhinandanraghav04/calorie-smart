# Vercel Setup Guide for Calorie Smart MVP

This guide provides step-by-step instructions for deploying Calorie Smart MVP to Vercel with Supabase.

## Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **USDA API Key Signup**: https://fdc.nal.usda.gov/api-key-signup.html
- **GitHub Repository**: [Your repo URL]

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] GitHub account with repository access
- [ ] Vercel account (free tier is sufficient)
- [ ] Supabase account (free tier is sufficient)
- [ ] Terminal access to run helper scripts (optional but recommended)

## Setup Process

### Phase 1: Database Setup (Supabase)

**Time estimate: 5 minutes**

1. **Create Supabase Project**
   - Navigate to https://supabase.com/dashboard
   - Click "New Project"
   - Fill in:
     - **Name**: `calorie-smart-staging` (or preferred name)
     - **Database Password**: Generate strong password (save securely!)
     - **Region**: Select closest to your target users
   - Click "Create new project"
   - Wait ~2 minutes for provisioning

2. **Get Database Connection String**
   - Once project is ready, go to **Project Settings** (gear icon)
   - Navigate to **Database** section
   - Scroll to **Connection string** section
   - Select **Connection pooling** tab (important!)
   - Mode: **Transaction** (recommended for Prisma)
   - Copy the URI
   - Replace `[YOUR-PASSWORD]` with your actual password

3. **Verify Connection String Format**
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   - Should include `pooler.supabase.com`
   - Should have `?pgbouncer=true` parameter
   - Port should be `6543` (not `5432`)

### Phase 2: Generate Secrets

**Time estimate: 1 minute**

1. **Generate NEXTAUTH_SECRET**
   
   Run this in your terminal:
   ```bash
   openssl rand -base64 32
   ```
   
   Or use the helper script:
   ```bash
   ./scripts/generate-env-template.sh
   ```
   
   Save the output - this is your `NEXTAUTH_SECRET`

2. **Get USDA API Key** (Optional)
   - Visit https://fdc.nal.usda.gov/api-key-signup.html
   - Fill out the form with your details
   - Check your email for the API key
   - Save this as `FDC_API_KEY`
   - Skip this step if you don't want food search functionality

### Phase 3: Vercel Project Setup

**Time estimate: 3 minutes**

1. **Import Repository**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub account
   - Find and import `calorie-smart-mvp` repository
   - Click "Import"

2. **Configure Project Settings**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `.` (leave as default)
   - **Build Command**: Leave empty (uses `pnpm build` from package.json)
   - **Install Command**: Leave empty (uses `pnpm install`)

3. **Don't Deploy Yet!** - Click the dropdown on "Deploy" and select "Continue" without deploying

### Phase 4: Environment Variables

**Time estimate: 3 minutes**

1. **Add Environment Variables**
   
   In the Vercel project configuration, add these variables:

   | Variable Name | Value | Notes |
   |---------------|-------|-------|
   | `DATABASE_URL` | [Your Supabase connection string] | From Phase 1 |
   | `NEXTAUTH_SECRET` | [Generated secret] | From Phase 2 |
   | `NEXTAUTH_URL` | `https://[your-project].vercel.app` | Use Vercel's suggested URL |
   | `NODE_ENV` | `production` | Exactly as shown |
   | `FDC_API_KEY` | [Your USDA API key] | Optional - from Phase 2 |

2. **Environment Selection**
   - Apply all variables to: **Production**, **Preview**, **Development**
   - This ensures consistency across all deployment types

3. **Verify All Variables**
   - Double-check no typos
   - Ensure no trailing spaces
   - Verify `NEXTAUTH_URL` has no trailing slash
   - Confirm `DATABASE_URL` includes `?pgbouncer=true`

### Phase 5: Deploy

**Time estimate: 2-3 minutes**

1. **Trigger First Deployment**
   - Click "Deploy" button
   - Watch the build logs in real-time
   - Wait for "Building..." → "Running..." → "Completed"

2. **Monitor Build Process**
   - Should see:
     - ✓ Dependencies installed
     - ✓ Prisma client generated (postinstall hook)
     - ✓ Database migrations applied
     - ✓ Next.js build completed
     - ✓ Functions deployed

3. **Handle Build Errors** (if any)
   - Check environment variables are set correctly
   - Verify Supabase project is active
   - Review build logs for specific error messages
   - See Troubleshooting section below

### Phase 6: Verification

**Time estimate: 10 minutes**

1. **Copy Deployment URL**
   - After successful deployment, copy the URL
   - Format: `https://[project-name].vercel.app`

2. **Run Automated Checks** (optional)
   ```bash
   ./scripts/verify-deployment.sh https://your-deployment-url.vercel.app
   ```

3. **Manual Testing Checklist**

   Visit your deployment URL and test:

   **Authentication Flow**
   - [ ] Navigate to sign-up page
   - [ ] Create account with email/password
   - [ ] Verify redirect after sign-up
   - [ ] Sign out
   - [ ] Sign back in with credentials
   - [ ] Try accessing `/dashboard` while logged out (should redirect to `/signin`)

   **Onboarding Flow**
   - [ ] Sign in with new account
   - [ ] Complete onboarding form:
     - Age, gender, height, weight
     - Activity level selection
     - Goal selection (lose/maintain/gain)
   - [ ] Verify calorie target is calculated and displayed
   - [ ] Submit form and verify redirect to dashboard

   **Dashboard Features**
   - [ ] Add a new food entry (name, calories, meal type)
   - [ ] Verify daily total updates correctly
   - [ ] Edit the food entry
   - [ ] Verify changes reflect in daily total
   - [ ] Delete the food entry
   - [ ] Verify daily total decrements
   - [ ] Add multiple entries for different meal types
   - [ ] Switch to different dates
   - [ ] Verify data persists across page refreshes

   **History Page**
   - [ ] Navigate to History page
   - [ ] Verify 7-day view displays
   - [ ] Check sparkline chart renders
   - [ ] Verify daily totals match dashboard
   - [ ] Check variance calculations vs target
   - [ ] Verify entries are grouped by day
   - [ ] Test date range navigation

   **Food Search** (if FDC_API_KEY configured)
   - [ ] Navigate to Food Search page
   - [ ] Search for "apple"
   - [ ] Verify results load from USDA
   - [ ] Check calorie information displays
   - [ ] Quick-add an item
   - [ ] Verify it appears on dashboard
   - [ ] Try various search terms

4. **Performance Checks**
   - [ ] Page load times are reasonable (< 3 seconds)
   - [ ] No console errors in browser dev tools
   - [ ] Navigation between pages is smooth
   - [ ] Forms submit without delays

### Phase 7: Post-Deployment

**Time estimate: 5 minutes**

1. **Update NEXTAUTH_URL** (if needed)
   - If your actual URL differs from what you set initially
   - Go to Vercel Project Settings → Environment Variables
   - Update `NEXTAUTH_URL` with correct value
   - Redeploy: Deployments tab → ... menu → Redeploy

2. **Document Deployment**
   - Update `STAGING_DEPLOYMENT_NOTES.md` with:
     - Deployment date
     - Your name
     - Verification status
     - Any issues encountered

3. **Share Staging URL**
   - Post in PR comments
   - Share with team for QA
   - Add to project documentation

## Troubleshooting

### Build Failures

**Issue: Prisma migration fails**
```
Error: Can't reach database server
```
**Solution:**
- Verify `DATABASE_URL` is set correctly in Vercel
- Check Supabase project is active (not paused)
- Ensure connection string uses connection pooling mode
- Verify password in connection string is correct

**Issue: NextAuth configuration error**
```
Error: NEXTAUTH_SECRET is not set
```
**Solution:**
- Verify all environment variables are added to Vercel
- Ensure variables are applied to "Production" environment
- Redeploy after adding variables

**Issue: Build timeout**
```
Error: Build exceeded maximum duration
```
**Solution:**
- Check for large dependencies
- Verify Vercel account limits
- Consider upgrading Vercel plan if needed

### Runtime Errors

**Issue: Database connection errors**
```
Error: Can't reach database server at `aws-0-us-east-1.pooler.supabase.com`
```
**Solution:**
- Ensure Supabase project is not paused (free tier auto-pauses after inactivity)
- Unpause from Supabase dashboard
- Verify `?pgbouncer=true` parameter in connection string

**Issue: Authentication not working**
```
Error: [next-auth][error][NO_SECRET]
```
**Solution:**
- Verify `NEXTAUTH_SECRET` is set in Vercel
- Check `NEXTAUTH_URL` matches deployment URL exactly
- Ensure no trailing slashes in `NEXTAUTH_URL`
- Redeploy after fixing

**Issue: Food search not working**
```
Error: FDC_API_KEY is not configured
```
**Solution:**
- This is expected if you didn't add `FDC_API_KEY`
- Food search feature is optional
- Add key from https://fdc.nal.usda.gov/api-key-signup.html if needed

### Database Issues

**Issue: Migrations not applied**
```
Error: Table does not exist
```
**Solution:**
- Check build logs for migration errors
- Verify `prisma migrate deploy` ran during build
- Manually run migrations if needed:
  ```bash
  pnpm prisma migrate deploy
  ```

**Issue: Supabase project paused**
```
Error: database "postgres" is not currently accepting connections
```
**Solution:**
- Go to Supabase dashboard
- Resume the project
- Wait 1-2 minutes for project to wake up
- Retry deployment or refresh page

## Environment Variable Reference

| Variable | Required | Description | Where to Get It |
|----------|----------|-------------|-----------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string with pgbouncer | Supabase Project Settings → Database → Connection Pooling |
| `NEXTAUTH_SECRET` | ✅ Yes | Random string for JWT signing (32+ characters) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ Yes | Full URL of deployed app (no trailing slash) | Vercel deployment URL |
| `NODE_ENV` | ✅ Yes | Set to `production` for all deployments | Manual entry: `production` |
| `FDC_API_KEY` | ❌ No | USDA FoodData Central API key | https://fdc.nal.usda.gov/api-key-signup.html |

## Helper Commands

Generate environment variable template:
```bash
./scripts/generate-env-template.sh
```

Verify deployed application:
```bash
./scripts/verify-deployment.sh https://your-url.vercel.app
```

Check build locally before deploying:
```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Additional Resources

- **Full Deployment Guide**: See `DEPLOYMENT.md` for comprehensive documentation
- **Step-by-Step Checklist**: See `DEPLOYMENT_CHECKLIST.md` for printable checklist
- **Deployment Notes**: See `STAGING_DEPLOYMENT_NOTES.md` for deployment history
- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment/deploy-to-vercel

## Support

If you encounter issues not covered in this guide:

1. Check Vercel deployment logs for specific errors
2. Review Supabase dashboard for database health
3. Consult `DEPLOYMENT.md` troubleshooting section
4. Search Vercel/Supabase documentation
5. Open an issue in the repository with:
   - Error message
   - Steps to reproduce
   - Build logs (if applicable)

## Next Steps After Staging

Once staging is verified and stable:

1. **Custom Domain** (optional)
   - Add custom domain in Vercel settings
   - Update DNS records
   - Update `NEXTAUTH_URL` environment variable

2. **Monitoring Setup**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry, etc.)
   - Configure uptime monitoring

3. **Production Deployment**
   - Create separate Supabase project for production
   - Set up separate Vercel project or use branch-based environments
   - Apply same configuration with production values

4. **Security Review**
   - Rotate secrets regularly
   - Review Supabase security settings
   - Enable rate limiting if needed
   - Set up database backups

---

**Happy deploying! 🚀**
