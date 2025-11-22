# Deployment Checklist

## Pre-Deployment Setup

### 1. Repository Setup
- [ ] Code pushed to GitHub repository
- [ ] Branch structure: `main` (production), `develop` (staging)
- [ ] `.gitignore` properly configured
- [ ] Environment variables documented in `.env.example`

### 2. Supabase Setup
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Get PostgreSQL connection string
- [ ] Configure database settings (pooling, timeouts)
- [ ] Set up IP allowlist if needed

### 3. Vercel Setup
- [ ] Create Vercel account
- [ ] Install Vercel CLI locally
- [ ] Connect GitHub repository to Vercel
- [ ] Get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`
- [ ] Generate Vercel token (`vercel token create`)

### 4. API Keys
- [ ] Get USDA FDC API key from [fdc.nal.usda.gov](https://fdc.nal.usda.gov/api-key-signup)
- [ ] Generate NextAuth secret: `openssl rand -base64 32`

## Environment Variables Configuration

### Production (Vercel)
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[GENERATED-SECRET]
FDC_API_KEY=[USDA-FDC-API-KEY]
```

### GitHub Secrets
```bash
VERCEL_TOKEN=[VERCEL-DEPLOYMENT-TOKEN]
VERCEL_ORG_ID=[YOUR-ORG-ID]
VERCEL_PROJECT_ID=[YOUR-PROJECT-ID]
```

## Deployment Process

### 1. Initial Setup
```bash
# Clone repository
git clone [repository-url]
cd calorie-smart-mvp

# Install dependencies
pnpm install

# Test locally
pnpm dev
```

### 2. Database Setup
```bash
# Generate Prisma client
pnpm prisma:generate

# Create and apply initial migration
pnpm prisma:migrate --name init

# Seed demo data (optional)
pnpm prisma:seed
```

### 3. Vercel Deployment
```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Post-Deployment Verification

### 1. Application Health Checks
- [ ] Application loads successfully
- [ ] Database connection working
- [ ] Authentication flow functional
- [ ] User registration works
- [ ] User login works
- [ ] Protected routes accessible when authenticated
- [ ] Protected routes redirect when not authenticated

### 2. Environment Variables
- [ ] All required env vars set in Vercel
- [ ] Database connection string valid
- [ ] NextAuth secret configured
- [ ] FDC API key working
- [ ] NextAuth URL matches deployment URL

### 3. Database
- [ ] Prisma migrations applied successfully
- [ ] User table created
- [ ] Database accessible from Vercel
- [ ] Connection pooling configured

### 4. Performance
- [ ] Page load times acceptable
- [ ] API routes responding quickly
- [ ] Database queries optimized
- [ ] No console errors

## Monitoring and Maintenance

### 1. Vercel Dashboard
- Monitor function execution time
- Check error logs
- Review bandwidth usage
- Track deployment history

### 2. Supabase Dashboard
- Monitor database performance
- Check connection limits
- Review query analytics
- Monitor storage usage

### 3. GitHub Actions
- Verify automated deployments
- Check workflow status
- Review test results
- Monitor deployment logs

## Troubleshooting

### Common Issues and Solutions

#### Database Connection Errors
**Problem**: `Database connection failed`
**Solution**: 
1. Verify `DATABASE_URL` format
2. Check Supabase project status
3. Ensure IP allowlist includes Vercel
4. Validate connection string credentials

#### NextAuth Issues
**Problem**: Authentication not working
**Solution**:
1. Verify `NEXTAUTH_URL` matches deployment URL
2. Regenerate `NEXTAUTH_SECRET`
3. Check callback URL configuration
4. Review NextAuth logs

#### Build Failures
**Problem**: Build failing on Vercel
**Solution**:
1. Check all environment variables are set
2. Verify Prisma schema validity
3. Run `pnpm typecheck` locally
4. Check for missing dependencies

#### Migration Issues
**Problem**: Database migrations not applying
**Solution**:
1. Verify `DATABASE_URL` permissions
2. Check migration file syntax
3. Run `pnpm prisma:migrate:deploy` manually
4. Review migration logs

## Rollback Procedures

### Vercel Rollback
```bash
# View deployment history
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Database Rollback
```bash
# View migration history
npx prisma migrate status

# Reset database (emergency only)
npx prisma migrate reset
```

## Security Considerations

### 1. Environment Variables
- [ ] Never commit `.env` files
- [ ] Use different secrets for staging/production
- [ ] Rotate secrets regularly
- [ ] Monitor for secret exposure

### 2. Database Security
- [ ] Use connection pooling
- [ ] Enable SSL connections
- [ ] Monitor for unusual activity
- [ ] Regular backups configured

### 3. Application Security
- [ ] HTTPS enforced
- [ ] Secure cookie settings
- [ ] Input validation working
- [ ] Rate limiting configured

## Scaling Checklist

### When to Scale
- [ ] Database connections near limit
- [ ] High function execution times
- [ ] Frequent timeouts
- [ ] Memory usage high

### Scaling Options
- [ ] Upgrade Vercel plan
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Implement caching