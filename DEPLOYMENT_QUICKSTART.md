# Deployment Quick Start

This is a condensed version of the deployment guide. For full details, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Prerequisites Checklist

- [ ] Vercel account created
- [ ] Supabase account created
- [ ] FDC API key obtained from https://fdc.nal.usda.gov/api-key-signup.html
- [ ] Repository pushed to GitHub/GitLab/Bitbucket

## Step 1: Supabase Setup (5 minutes)

1. Create new project at https://supabase.com
2. Save your database password securely
3. Get connection strings from **Settings** → **Database**:
   - **Pooled Connection** (Transaction mode) → Add `&connection_limit=1`
   - **Direct Connection** (URI)

## Step 2: Vercel Setup (5 minutes)

1. Import your repository at https://vercel.com
2. Add environment variables in **Settings** → **Environment Variables**:

```bash
# Required for all environments (Production, Preview, Development)
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@....pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
DATABASE_DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
FDC_API_KEY="your-fdc-api-key"

# Production only
NEXTAUTH_URL="https://your-app.vercel.app"

# Preview/Development
NEXTAUTH_URL="https://$VERCEL_URL"
```

## Step 3: Deploy

1. Click **Deploy** in Vercel
2. Wait for build to complete (migrations run automatically)
3. Visit your production URL
4. Test sign up, sign in, and dashboard

## Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
./scripts/generate-secret.sh

# Or directly:
openssl rand -base64 32
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Migration fails | Check DATABASE_DIRECT_URL is set correctly |
| Connection timeout | Ensure connection strings have passwords replaced |
| NextAuth error | Verify NEXTAUTH_URL matches deployment URL |
| Build fails | Check all environment variables are set |

## Verify Deployment

- [ ] Production URL loads
- [ ] Can sign up for new account
- [ ] Can sign in with credentials
- [ ] Dashboard is accessible
- [ ] Can sign out
- [ ] Preview deployments work on new branches

## Next Steps

- Set up staging environment (optional)
- Configure custom domain
- Set up monitoring and alerts
- Review security best practices in [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Need more details?** See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide.
