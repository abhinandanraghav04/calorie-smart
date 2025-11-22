# Deployment Guide

This guide covers deploying the Calorie Smart MVP to Vercel with Supabase PostgreSQL.

## Prerequisites

- Vercel account
- Supabase account
- USDA Food Data Central API key

## Step 1: Set up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to Settings > Database
3. Copy the connection string from "Connection string" > "URI"
4. The format should be: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 2: Environment Variables

Set these environment variables in Vercel:

### Required Variables
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[GENERATED-SECRET]
FDC_API_KEY=[YOUR-USDA-FDC-API-KEY]
```

### Optional Variables (for preview deployments)
```
DEMO_USER_EMAIL=demo@example.com
DEMO_USER_PASSWORD=password123
```

### Generating NEXTAUTH_SECRET
Run this command locally:
```bash
openssl rand -base64 32
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

### Option B: Using Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Configure environment variables in the dashboard
3. Deploy automatically on push to main branch

## Step 4: Database Migration

The deployment automatically handles Prisma migrations using:
- `prisma migrate deploy` for production database schema
- `prisma generate` for client generation

## Step 5: USDA FDC API Key

1. Visit [USDA Food Data Central](https://fdc.nal.usda.gov/api-key-signup)
2. Request an API key (free for developers)
3. Add the key to your Vercel environment variables as `FDC_API_KEY`

## Environment-Specific Configuration

### Production
- `NEXTAUTH_URL`: Your production Vercel URL
- `DATABASE_URL`: Supabase production connection string

### Preview Deployments
- `NEXTAUTH_URL`: Automatically set by Vercel
- `DATABASE_URL`: Use a separate Supabase project for previews

## Monitoring and Logs

- Check Vercel Functions logs for API errors
- Monitor Supabase database usage in their dashboard
- Review NextAuth session logs in Vercel

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` format
   - Check Supabase project status
   - Ensure IP allowlist includes Vercel's IPs

2. **NextAuth Issues**
   - Verify `NEXTAUTH_URL` matches deployment URL
   - Regenerate `NEXTAUTH_SECRET` if needed
   - Check callback URLs in NextAuth config

3. **Build Failures**
   - Ensure all environment variables are set
   - Check Prisma schema validity
   - Verify TypeScript compilation

### Rollback Procedure
```bash
# Rollback to previous deployment
vercel rollback [deployment-url]
```

## Performance Optimization

### Database
- Enable connection pooling in Supabase
- Monitor query performance
- Consider read replicas for high traffic

### Vercel
- Enable Edge Functions for API routes
- Configure proper caching headers
- Monitor function execution time

## Security Considerations

- Rotate `NEXTAUTH_SECRET` regularly
- Use environment-specific API keys
- Enable Vercel Analytics for monitoring
- Set up proper CORS headers if needed

## Scaling

### Database Scaling
- Monitor Supabase usage limits
- Upgrade plan as needed
- Implement proper indexing

### Application Scaling
- Monitor Vercel function execution
- Consider Edge Network optimization
- Implement proper error boundaries