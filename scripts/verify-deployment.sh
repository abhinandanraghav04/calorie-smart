#!/bin/bash
# Quick deployment verification script
# Usage: ./scripts/verify-deployment.sh https://your-staging-url.vercel.app

set -e

STAGING_URL="${1}"

if [ -z "$STAGING_URL" ]; then
  echo "❌ Error: Please provide staging URL"
  echo "Usage: ./scripts/verify-deployment.sh https://your-staging-url.vercel.app"
  exit 1
fi

echo "=================================================="
echo "Deployment Verification"
echo "=================================================="
echo ""
echo "Target URL: $STAGING_URL"
echo ""
echo "Running automated checks..."
echo ""

# Check if URL is reachable
echo -n "✓ Checking if site is reachable... "
if curl -s -o /dev/null -w "%{http_code}" "$STAGING_URL" | grep -q "200"; then
  echo "✅ OK"
else
  echo "❌ FAILED"
  echo "  Site returned non-200 status code"
  exit 1
fi

# Check for NextAuth API endpoint
echo -n "✓ Checking NextAuth API... "
if curl -s "$STAGING_URL/api/auth/session" | grep -q "null"; then
  echo "✅ OK"
else
  echo "❌ FAILED"
  echo "  NextAuth API endpoint not responding correctly"
fi

# Check for sign-in page
echo -n "✓ Checking sign-in page... "
if curl -s "$STAGING_URL/signin" | grep -q "sign"; then
  echo "✅ OK"
else
  echo "❌ FAILED"
  echo "  Sign-in page not accessible"
fi

echo ""
echo "=================================================="
echo "Manual Verification Checklist"
echo "=================================================="
echo ""
echo "Please manually verify the following in your browser:"
echo ""
echo "[ ] Authentication"
echo "    - Sign up with new email/password"
echo "    - Sign out"
echo "    - Sign back in"
echo "    - Protected routes redirect to /signin"
echo ""
echo "[ ] Onboarding"
echo "    - Complete profile form"
echo "    - Verify calorie target calculation"
echo "    - Redirect to dashboard after completion"
echo ""
echo "[ ] Dashboard"
echo "    - Add new food entry"
echo "    - Edit existing entry"
echo "    - Delete entry"
echo "    - Daily total updates correctly"
echo ""
echo "[ ] History"
echo "    - View 7-day history"
echo "    - Sparkline chart renders"
echo "    - Variance calculations correct"
echo ""
echo "[ ] Food Search (if FDC_API_KEY configured)"
echo "    - Search for foods"
echo "    - Quick-add from results"
echo "    - Verify data appears on dashboard"
echo ""
echo "=================================================="
echo ""
echo "Visit: $STAGING_URL"
echo ""
