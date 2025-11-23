#!/bin/bash
# Helper script to generate deployment environment variables template
# Run this before deploying to get a formatted list of env vars for Vercel

set -e

echo "=================================================="
echo "Deployment Environment Variables Template"
echo "=================================================="
echo ""
echo "Copy these to Vercel Project Settings → Environment Variables"
echo "Apply to both Production and Preview environments"
echo ""
echo "=================================================="
echo ""

# Generate NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)

echo "DATABASE_URL="
echo "  → Get from Supabase: Project Settings → Database → Connection Pooling"
echo "  → Format: postgresql://postgres.xxxxx:[PASSWORD]@....pooler.supabase.com:6543/postgres?pgbouncer=true"
echo ""

echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo "  → Generated above (keep this secure!)"
echo ""

echo "NEXTAUTH_URL="
echo "  → Your Vercel deployment URL"
echo "  → Example: https://calorie-smart-staging.vercel.app"
echo "  → Note: No trailing slash"
echo ""

echo "NODE_ENV=production"
echo "  → Required for production builds"
echo ""

echo "FDC_API_KEY="
echo "  → (Optional) USDA FoodData Central API key"
echo "  → Get from: https://fdc.nal.usda.gov/api-key-signup.html"
echo "  → Leave blank to skip food search feature"
echo ""

echo "=================================================="
echo ""
echo "Quick Setup Commands:"
echo "=================================================="
echo ""
echo "1. Create Supabase project:"
echo "   → https://supabase.com/dashboard"
echo ""
echo "2. Import to Vercel:"
echo "   → https://vercel.com/new"
echo ""
echo "3. Add environment variables above to Vercel"
echo ""
echo "4. Deploy and verify!"
echo ""
