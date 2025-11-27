# Staging Smoke Test Guide

This document provides step-by-step instructions for performing a comprehensive smoke test on the staging deployment.

## Prerequisites

Before testing, confirm the following:

- [ ] Staging URL is accessible (currently: https://calorie-smart-staging.vercel.app)
- [ ] All required environment variables are configured in Vercel:
  - [ ] `DATABASE_URL` (Supabase connection string)
  - [ ] `NEXTAUTH_URL` (matches the staging URL exactly)
  - [ ] `NEXTAUTH_SECRET` (32+ character string)
  - [ ] `FDC_API_KEY` (optional, for USDA search)
  - [ ] `NODE_ENV` (set to `production`)

> Tip: run `./scripts/verify-env.sh` locally (after copying `.env.example`) to confirm required variables are set before deploying.

## Test Environment Setup

### Demo User Credentials
- **Email:** `demo@example.com`
- **Password:** `password123`

The demo user is created via the database seed script and should be available if the database has been seeded.

### Test User Creation
For a fresh test, create a new account during Step 1 of the smoke test.

---

## Smoke Test Checklist

### 1. Authentication Flow

**Test Sign Up:**
- [ ] Navigate to the staging URL
- [ ] Click "Sign Up" (or navigate to `/auth/signup`)
- [ ] Enter a valid email and password (minimum 8 characters)
- [ ] Submit the form
- [ ] Verify you are redirected to the onboarding page (`/onboarding`)
- [ ] Confirm no error messages appear in the browser console

**Test Sign In:**
- [ ] Sign out (use the navigation menu or go to `/api/auth/signout`)
- [ ] Navigate to `/auth/signin`
- [ ] Enter the credentials you just created (or use `demo@example.com` / `password123`)
- [ ] Submit the form
- [ ] Verify you are redirected to the dashboard (`/dashboard`)
- [ ] Confirm your session is maintained across page refreshes

**Test Sign Out:**
- [ ] Click the sign-out button or navigate to `/api/auth/signout`
- [ ] Verify you are redirected to the home page or sign-in page
- [ ] Attempt to access `/dashboard` directly
- [ ] Confirm you are redirected to the sign-in page (protected route middleware)

---

### 2. Onboarding Flow

**Complete Profile Form:**
- [ ] Sign in with a new account that hasn't completed onboarding
- [ ] You should be redirected to `/onboarding`
- [ ] Fill out the profile form with valid data:
  - [ ] Age (e.g., `30`)
  - [ ] Gender (select from dropdown: Male, Female, Other)
  - [ ] Height (e.g., `170` cm)
  - [ ] Weight (e.g., `70` kg)
  - [ ] Activity level (select from dropdown: Sedentary, Lightly active, Moderately active, Very active, Extremely active)
  - [ ] Goal (select from dropdown: Lose weight, Maintain weight, Gain weight)
- [ ] Submit the form
- [ ] Verify you are redirected to the dashboard (`/dashboard`)

**Verify Calorie Target Calculation:**
- [ ] On the dashboard, confirm a calorie target is displayed (e.g., "2000 kcal target")
- [ ] The target should be calculated using the Mifflin-St. Jeor formula based on the profile data entered
- [ ] For reference:
  - BMR (Male) = 10 × weight(kg) + 6.25 × height(cm) − 5 × age(y) + 5
  - BMR (Female) = 10 × weight(kg) + 6.25 × height(cm) − 5 × age(y) − 161
  - TDEE = BMR × Activity Factor
  - Target = TDEE ± 500 (depending on goal: -500 for weight loss, +500 for weight gain)

---

### 3. Dashboard & Food Entry CRUD

**Add a Food Entry:**
- [ ] Navigate to `/dashboard`
- [ ] Click the "Add Food" button (or similar CTA)
- [ ] A modal or form should appear
- [ ] Fill in the food entry details:
  - [ ] Food name (e.g., "Chicken Breast")
  - [ ] Calories (e.g., `165`)
  - [ ] Serving size (e.g., "100g", optional)
- [ ] Submit the form
- [ ] Verify the new food entry appears in the today's food list
- [ ] Verify the daily calorie total and progress ring update to reflect the new entry
- [ ] Check the browser console for any errors

**Edit a Food Entry:**
- [ ] Click the edit button/icon on the food entry you just added
- [ ] Modify one or more fields (e.g., change calories to `200`)
- [ ] Save the changes
- [ ] Verify the food entry updates in the list
- [ ] Verify the daily calorie total and progress ring update accordingly
- [ ] Check the browser console for any errors

**Delete a Food Entry:**
- [ ] Click the delete button/icon on the food entry
- [ ] Confirm the deletion if a confirmation modal appears
- [ ] Verify the food entry is removed from the list
- [ ] Verify the daily calorie total and progress ring update accordingly
- [ ] Check the browser console for any errors

**Progress Ring Behavior:**
- [ ] Add multiple food entries to reach different percentage thresholds (e.g., 50%, 80%, 100%, 120%)
- [ ] Verify the progress ring color changes appropriately:
  - Green/normal when under target
  - Yellow/warning when approaching target
  - Red/danger when exceeding target
- [ ] Verify the percentage and calorie counts are accurate

---

### 4. 7-Day History View

**Navigate to History:**
- [ ] Click the "History" link in the navigation sidebar (or navigate to `/history`)
- [ ] The page should load without errors

**Verify Chart Rendering:**
- [ ] A sparkline or line chart should render showing the last 7 days of calorie intake
- [ ] Each day should show:
  - Date label
  - Total calories consumed
  - Variance vs. target (e.g., "-200 kcal" or "+300 kcal")
- [ ] If no data exists for previous days, they should show 0 calories or a placeholder

**Add Data and Verify Chart Updates:**
- [ ] Navigate back to `/dashboard`
- [ ] Add a new food entry
- [ ] Navigate back to `/history`
- [ ] Verify today's data point updates to reflect the new entry
- [ ] The sparkline should re-render with the updated data

---

### 5. USDA Food Search Integration

**Prerequisites:**
- This feature requires the `FDC_API_KEY` environment variable to be set in Vercel.
- If the key is missing, the search modal should display a helpful message or empty state.

**Test USDA Search (if API key is configured):**
- [ ] Navigate to `/dashboard`
- [ ] Click the "Add Food" button
- [ ] Look for a "Search USDA" button, tab, or link in the modal
- [ ] Click to open the USDA search interface
- [ ] Enter a food name in the search field (e.g., "apple")
- [ ] Submit the search
- [ ] Verify search results appear with food names and calorie information
- [ ] Select a food from the results
- [ ] Verify the food details (name, calories, serving size) are populated in the add food form
- [ ] Submit the form to add the food entry
- [ ] Verify the entry appears on the dashboard with the correct data

**Test USDA Search (if API key is NOT configured):**
- [ ] Navigate to `/dashboard`
- [ ] Click the "Add Food" button
- [ ] Look for a "Search USDA" button or tab
- [ ] If the feature is disabled, verify a helpful message is shown (e.g., "USDA search is not available. Please add food manually.")
- [ ] Verify you can still add food entries manually

---

## Regression Checks

**Common Issues to Watch For:**
- [ ] **Database Connection Errors**: Check build logs in Vercel for Prisma connection issues
- [ ] **NextAuth Configuration Errors**: Verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are set correctly
- [ ] **API Route Errors**: Check for 500 errors when submitting forms or fetching data
- [ ] **Hydration Errors**: Check browser console for React hydration mismatches
- [ ] **Protected Route Middleware**: Ensure unauthenticated users cannot access `/dashboard`, `/onboarding`, `/history`, `/settings`
- [ ] **Mobile Responsiveness**: Test on a mobile device or use browser DevTools to simulate mobile viewports
- [ ] **Performance**: Check Vercel Speed Insights for slow page loads or API calls

---

## Environment Variable Verification

Before running the smoke test, verify these environment variables are set in Vercel (Project Settings → Environment Variables):

| Variable          | Required | Value Format                                      | Example                                           |
|-------------------|----------|---------------------------------------------------|---------------------------------------------------|
| `DATABASE_URL`    | ✅       | PostgreSQL connection string with pgbouncer       | `postgresql://user:pass@host:5432/db?pgbouncer=true` |
| `NEXTAUTH_URL`    | ✅       | Deployed staging URL (no trailing slash)          | `https://calorie-smart-staging.vercel.app`        |
| `NEXTAUTH_SECRET` | ✅       | Random 32+ character string                       | (generate with `openssl rand -base64 32`)         |
| `FDC_API_KEY`     | ❌       | USDA FoodData Central API key                     | (obtain from https://fdc.nal.usda.gov/api-key-signup.html) |
| `NODE_ENV`        | ✅       | Set to `production` for staging/prod              | `production`                                      |

To check if environment variables are set (without exposing values):
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Confirm each required variable is present
3. Ensure variables are applied to both "Production" and "Preview" environments

---

## Troubleshooting

### Deployment Not Found (404)
- **Symptom**: Visiting the staging URL returns a 404 or "DEPLOYMENT_NOT_FOUND" error
- **Fix**: Verify the deployment has been successfully created in Vercel. Check that the GitHub repository is connected and a deployment has been triggered.

### Build Fails with Prisma Errors
- **Symptom**: Vercel build logs show Prisma migration or generation errors
- **Fix**: Ensure `DATABASE_URL` is set correctly and the database is accessible. Verify the connection string includes `?pgbouncer=true` for Supabase.

### NextAuth Errors (Callback URL Mismatch)
- **Symptom**: After signing in, you see an error about callback URL mismatch
- **Fix**: Ensure `NEXTAUTH_URL` in Vercel exactly matches the staging URL (no trailing slash).

### Database Connection Timeout
- **Symptom**: API routes return 500 errors with "database connection timeout" in logs
- **Fix**: Check that the Supabase project is not paused (free tier projects auto-pause after inactivity). Verify the connection string uses connection pooling.

### USDA Search Not Working
- **Symptom**: USDA search returns no results or shows an error
- **Fix**: Verify `FDC_API_KEY` is set in Vercel. Check the API key is valid by testing it directly at https://fdc.nal.usda.gov/api-guide.html.

---

## Reporting Issues

If you encounter any issues during the smoke test:

1. **Document the Issue**:
   - Describe the steps to reproduce
   - Include screenshots or screen recordings if possible
   - Copy any error messages from the browser console or Vercel logs

2. **Quick Fixes**:
   - If the issue is trivial (typo, missing CSS, etc.), patch it immediately
   - For more complex issues, note them as follow-up tasks

3. **Update Ticket**:
   - Add a comment to the original ticket with:
     - ✅ Passed tests
     - ❌ Failed tests
     - 📝 Notes for follow-up

---

## Sign-Off

After completing the smoke test, update the `STAGING_DEPLOYMENT_NOTES.md` file with:

- **Deployed**: [Deployment date]
- **Deployed By**: [Your name]
- **Verified**: [Verification date/name]
- **Status**: ✅ All tests passed / ⚠️ Issues found (see notes)

Then update the PR description with:

```markdown
## Smoke Test Results

**Staging URL**: https://calorie-smart-staging.vercel.app

**Test Date**: [Date]

**Test Results**:
- ✅ Authentication (sign up, sign in, sign out)
- ✅ Onboarding (profile form, calorie calculation)
- ✅ Food Entry CRUD (add, edit, delete)
- ✅ Dashboard (progress ring, daily totals)
- ✅ 7-Day History (chart rendering, data accuracy)
- ✅/❌ USDA Search (if API key configured)

**Issues Found**: [None / List issues]

**Follow-Up Tasks**: [None / List tasks]
```

---

## Additional Resources

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
- [STAGING_DEPLOYMENT_NOTES.md](./STAGING_DEPLOYMENT_NOTES.md) - Quick reference for this deployment
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
