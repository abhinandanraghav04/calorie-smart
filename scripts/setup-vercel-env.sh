#!/bin/bash

# Setup Vercel Environment Variables via CLI
# Prerequisites: Install Vercel CLI with: npm i -g vercel
# Run: vercel login

echo "Setting up Vercel environment variables..."
echo ""
echo "This script will help you set environment variables in Vercel."
echo "Make sure you have:"
echo "  1. Installed Vercel CLI: npm i -g vercel"
echo "  2. Logged in: vercel login"
echo "  3. Linked your project: vercel link"
echo ""

read -p "Have you completed the prerequisites? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Please complete prerequisites first."
    exit 1
fi

echo ""
echo "Enter your environment variables:"
echo ""

read -p "DATABASE_URL (Supabase pooled connection): " DATABASE_URL
read -p "DATABASE_DIRECT_URL (Supabase direct connection): " DATABASE_DIRECT_URL
read -p "NEXTAUTH_URL (Production URL, e.g., https://your-app.vercel.app): " NEXTAUTH_URL
read -p "NEXTAUTH_SECRET (generate with: openssl rand -base64 32): " NEXTAUTH_SECRET
read -p "FDC_API_KEY (USDA FoodData Central API key): " FDC_API_KEY

echo ""
echo "Setting environment variables for Production, Preview, and Development..."
echo ""

vercel env add DATABASE_URL production preview development <<< "$DATABASE_URL"
vercel env add DATABASE_DIRECT_URL production preview development <<< "$DATABASE_DIRECT_URL"
vercel env add NEXTAUTH_URL production <<< "$NEXTAUTH_URL"
vercel env add NEXTAUTH_URL preview development <<< "https://\$VERCEL_URL"
vercel env add NEXTAUTH_SECRET production preview development <<< "$NEXTAUTH_SECRET"
vercel env add FDC_API_KEY production preview development <<< "$FDC_API_KEY"

echo ""
echo "✓ Environment variables configured!"
echo ""
echo "Next steps:"
echo "  1. Deploy: vercel --prod"
echo "  2. Visit your production URL"
echo "  3. Test sign up and sign in"
