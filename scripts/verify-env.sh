#!/bin/bash

# Environment Variable Verification Script
# This script helps verify that all required environment variables are set
# Usage: ./scripts/verify-env.sh

set -e

echo "🔍 Verifying Environment Variables..."
echo ""

# Required variables
REQUIRED_VARS=(
  "DATABASE_URL"
  "NEXTAUTH_URL"
  "NEXTAUTH_SECRET"
  "NODE_ENV"
)

# Optional variables
OPTIONAL_VARS=(
  "FDC_API_KEY"
  "DEMO_USER_EMAIL"
  "DEMO_USER_PASSWORD"
)

# Track if all required vars are set
ALL_REQUIRED_SET=true

echo "✅ Required Variables:"
for var in "${REQUIRED_VARS[@]}"; do
  if [ -n "${!var}" ]; then
    # Mask the value for security
    if [[ "$var" == *"SECRET"* ]] || [[ "$var" == *"PASSWORD"* ]] || [[ "$var" == *"URL"* ]]; then
      echo "  ✓ $var is set (value hidden for security)"
    else
      echo "  ✓ $var is set"
    fi
  else
    echo "  ✗ $var is NOT set"
    ALL_REQUIRED_SET=false
  fi
done

echo ""
echo "📦 Optional Variables:"
for var in "${OPTIONAL_VARS[@]}"; do
  if [ -n "${!var}" ]; then
    echo "  ✓ $var is set"
  else
    echo "  ⚠ $var is not set (optional)"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$ALL_REQUIRED_SET" = true ]; then
  echo "✅ All required environment variables are set!"
  echo ""
  echo "Next steps:"
  echo "  1. Verify the values are correct (especially NEXTAUTH_URL)"
  echo "  2. Run 'pnpm build' to test the build locally"
  echo "  3. Deploy to Vercel and run the smoke test"
  exit 0
else
  echo "❌ Some required environment variables are missing!"
  echo ""
  echo "Please set the missing variables in your .env file or Vercel dashboard."
  echo "See .env.example for reference."
  exit 1
fi
