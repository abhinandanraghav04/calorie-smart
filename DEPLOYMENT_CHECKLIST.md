# Deployment Checklist

Use this checklist to ensure your deployment is configured correctly.

## Pre-Deployment

### Supabase Setup
- [ ] Supabase account created
- [ ] New Supabase project created
- [ ] Database password saved securely
- [ ] Pooled connection string (Transaction mode) copied
- [ ] Direct connection string (URI) copied
- [ ] Both connection strings have `[YOUR-PASSWORD]` replaced with actual password
- [ ] `&connection_limit=1` added to pooled connection string

### API Keys
- [ ] USDA FoodData Central API key obtained from https://fdc.nal.usda.gov/api-key-signup.html
- [ ] API key tested and working

### Secrets
- [ ] `NEXTAUTH_SECRET` generated using `openssl rand -base64 32`
- [ ] Secret saved securely (different for production and preview)

## Vercel Configuration

### Project Setup
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Framework preset set to Next.js (auto-detected)
- [ ] Build command: `pnpm build`
- [ ] Install command: `pnpm install`

### Environment Variables
Configure these in Vercel **Settings** → **Environment Variables**:

#### Production + Preview + Development
- [ ] `DATABASE_URL` - Supabase pooled connection with `&connection_limit=1`
- [ ] `DATABASE_DIRECT_URL` - Supabase direct connection
- [ ] `NEXTAUTH_SECRET` - Generated secret
- [ ] `FDC_API_KEY` - USDA FoodData Central API key

#### Production Only
- [ ] `NEXTAUTH_URL` - Production URL (e.g., `https://your-app.vercel.app`)

#### Preview/Development
- [ ] `NEXTAUTH_URL` - Set to `https://$VERCEL_URL` or auto-generated

## Deployment

### First Deployment
- [ ] Click **Deploy** in Vercel
- [ ] Build logs show successful migration: `✓ Migration applied successfully`
- [ ] Build completes without errors
- [ ] Deployment successful

### Post-Deployment Testing
- [ ] Production URL loads correctly
- [ ] Can access `/signup` page
- [ ] Can create new account
- [ ] Receives success message after signup
- [ ] Can sign in with new account
- [ ] Dashboard loads and displays user info
- [ ] Settings page accessible
- [ ] User dropdown menu works
- [ ] Can sign out successfully
- [ ] Redirected to home page after sign out

### Database Verification
- [ ] Check Supabase dashboard → Table Editor
- [ ] `users` table exists
- [ ] Test user record exists in database
- [ ] Email is stored correctly
- [ ] Password is hashed (not plain text)

## Preview Environments

### Branch Deployments
- [ ] Create a new branch
- [ ] Push changes to branch
- [ ] Vercel creates preview deployment automatically
- [ ] Preview deployment has unique URL
- [ ] Preview uses correct environment variables
- [ ] Migrations run on preview deployment

## Optional: Staging Environment

### Staging Setup
- [ ] Separate Supabase project created for staging
- [ ] `staging` branch created in repository
- [ ] Branch-specific environment variables configured
- [ ] Staging deployment successful
- [ ] Staging URL documented

## Production Readiness

### Security
- [ ] All secrets are secure and not exposed
- [ ] `NEXTAUTH_SECRET` is strong and random
- [ ] Database credentials are not in code
- [ ] `.env` files are in `.gitignore`
- [ ] SSL/HTTPS enabled (automatic with Vercel)

### Performance
- [ ] Database connection pooling enabled (`pgbouncer=true`)
- [ ] Connection limit set (`connection_limit=1`)
- [ ] Build completes in reasonable time
- [ ] Pages load quickly

### Monitoring
- [ ] Vercel deployment logs accessible
- [ ] Supabase logs accessible
- [ ] Error tracking configured (optional)
- [ ] Analytics configured (optional)

## Documentation

- [ ] `README.md` updated with deployment info
- [ ] `DEPLOYMENT.md` reviewed and accurate
- [ ] `DEPLOYMENT_QUICKSTART.md` available for team
- [ ] `.env.example` updated with all required variables
- [ ] `.env.production.example` available for reference

## Post-Launch

### Live URLs Documented
- [ ] Production URL: ___________________________
- [ ] Staging URL (if applicable): ___________________________
- [ ] Preview URL pattern documented

### Team Access
- [ ] Team members have Vercel access
- [ ] Team members have Supabase access (if needed)
- [ ] Deployment process documented for team
- [ ] Environment variables documented securely

### Maintenance Plan
- [ ] Backup strategy confirmed (Supabase automatic backups)
- [ ] Database migration process documented
- [ ] Rollback procedure documented
- [ ] Monitoring and alerting set up (optional)

## Troubleshooting Reference

If issues arise, refer to:
- **Common Issues**: See DEPLOYMENT.md Section 6.2
- **Vercel Logs**: Deployment → Logs tab
- **Supabase Logs**: Project → Logs
- **Migration Issues**: Check `DATABASE_DIRECT_URL` is set
- **Auth Issues**: Verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET`

---

**Status**: [ ] Deployment Complete ✓

**Deployed By**: ________________  
**Date**: ________________  
**Production URL**: ________________  
**Notes**: ________________
