# Staging Smoke Test Summary - PR #7

## Staging Environment

**URL:** https://calorie-smart-staging.vercel.app  
**Status:** ⚠️ Deployment verification pending (currently returns `DEPLOYMENT_NOT_FOUND`)

## Required Actions Before Testing

### 1. Verify Vercel Environment Variables

All required environment variables must be set in Vercel Project Settings before the deployment will function:

| Variable | Status | Notes |
|----------|--------|-------|
| `DATABASE_URL` | ⏳ Pending | Supabase Postgres connection string with `?pgbouncer=true` |
| `NEXTAUTH_URL` | ⏳ Pending | Must exactly match staging URL: `https://calorie-smart-staging.vercel.app` |
| `NEXTAUTH_SECRET` | ⏳ Pending | Generate with: `openssl rand -base64 32` |
| `FDC_API_KEY` | ⚠️ Optional | USDA FoodData Central API key (enables search) |
| `NODE_ENV` | ⏳ Pending | Set to `production` |

### 2. Verify Deployment Status

Before running the smoke test:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Confirm a deployment exists for this branch/PR
4. Check build logs for any errors
5. Visit the staging URL and verify it loads (not 404)

---

## Quick Smoke Test (5-10 minutes)

Once the deployment is live, follow these steps:

### 1️⃣ Authentication
- [ ] Sign up for a new account
- [ ] Sign out
- [ ] Sign in with demo credentials (`demo@example.com` / `password123`)
- [ ] Verify protected routes redirect to sign-in when not authenticated

### 2️⃣ Onboarding
- [ ] Complete the profile form with valid data (age, gender, height, weight, activity level, goal)
- [ ] Verify you are redirected to the dashboard
- [ ] Confirm a calorie target is displayed (e.g., "2000 kcal target")

### 3️⃣ Food Entry CRUD
- [ ] Add a food entry (e.g., "Chicken Breast", 165 calories)
- [ ] Verify the progress ring updates
- [ ] Edit the food entry (change calories to 200)
- [ ] Verify the progress ring updates again
- [ ] Delete the food entry
- [ ] Verify the progress ring resets

### 4️⃣ 7-Day History
- [ ] Navigate to the History page from the sidebar
- [ ] Verify the chart renders without errors
- [ ] Add a food entry on the dashboard
- [ ] Return to History and verify today's data point updates

### 5️⃣ USDA Search (Optional)
- [ ] Click "Add Food" on the dashboard
- [ ] Look for USDA search functionality
- [ ] If `FDC_API_KEY` is set: search for "apple" and verify results appear
- [ ] If key is not set: verify a helpful message is shown

---

## Test Results Template

Copy this template to the PR or ticket when posting results:

```markdown
## 🧪 Smoke Test Results

**Test Date:** [YYYY-MM-DD]  
**Tester:** [Your Name]  
**Staging URL:** https://calorie-smart-staging.vercel.app

### Environment Variables
- [✅/❌] DATABASE_URL configured
- [✅/❌] NEXTAUTH_URL configured
- [✅/❌] NEXTAUTH_SECRET configured
- [✅/❌] FDC_API_KEY configured (optional)
- [✅/❌] NODE_ENV set to production

### Primary Flows
- [✅/❌] Authentication (sign up, sign in, sign out)
- [✅/❌] Onboarding (profile form, calorie calculation)
- [✅/❌] Food Entry CRUD (add, edit, delete)
- [✅/❌] Dashboard (progress ring updates)
- [✅/❌] 7-Day History (chart rendering, data accuracy)
- [✅/❌] USDA Search (if API key configured)

### Issues Found
- [None / List issues with severity and reproduction steps]

### Follow-Up Tasks
- [None / List tasks with priority]

### Notes
- [Any additional observations or recommendations]
```

---

## Detailed Testing Instructions

For comprehensive step-by-step instructions, see [SMOKE_TEST.md](./SMOKE_TEST.md).

---

## Current Status (2025-11-27)

### ✅ Completed
- [x] Build configuration updated (`package.json`)
- [x] Database migrations created and tracked
- [x] Environment variable documentation complete
- [x] Deployment guides written (`DEPLOYMENT.md`, `SMOKE_TEST.md`)
- [x] README updated with staging URL and quick test steps
- [x] Environment verification script created (`scripts/verify-env.sh`)

### ⏳ Pending
- [ ] Vercel deployment created and accessible
- [ ] Environment variables configured in Vercel
- [ ] Database seeded with demo user
- [ ] Smoke test executed and results posted
- [ ] Any regressions or issues documented

### 🚧 Blockers
- **Staging URL not accessible:** Currently returns `DEPLOYMENT_NOT_FOUND`. This must be resolved before smoke testing can begin.
- **Environment variables:** Cannot confirm if required variables are set in Vercel without dashboard access.

---

## Next Steps

1. **Deploy to Vercel:**
   - Ensure the GitHub repository is connected to Vercel
   - Trigger a deployment for this branch/PR
   - Confirm the build completes successfully

2. **Configure Environment Variables:**
   - Add all required variables in Vercel Project Settings
   - Apply to both "Production" and "Preview" environments
   - Trigger a redeployment if variables were added after initial build

3. **Seed Demo User:**
   - After deployment, run `pnpm prisma:seed` against the staging database
   - Or manually create a user account for testing

4. **Run Smoke Test:**
   - Follow the quick smoke test steps above
   - Document any issues or regressions
   - Post results to this PR using the template above

5. **Address Issues:**
   - For trivial issues (typos, CSS tweaks), patch immediately
   - For complex issues, create follow-up tickets
   - Update this document with final results

---

## Support Resources

- **Full Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Comprehensive Smoke Test Checklist:** [SMOKE_TEST.md](./SMOKE_TEST.md)
- **Environment Variable Example:** [.env.example](./.env.example)
- **Quick Reference:** [STAGING_DEPLOYMENT_NOTES.md](./STAGING_DEPLOYMENT_NOTES.md)
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs

---

## Questions?

If you encounter any issues or have questions about the smoke test:
1. Check the troubleshooting section in [SMOKE_TEST.md](./SMOKE_TEST.md)
2. Review the deployment guide in [DEPLOYMENT.md](./DEPLOYMENT.md)
3. Post a comment on this PR with details (include screenshots and error logs)
