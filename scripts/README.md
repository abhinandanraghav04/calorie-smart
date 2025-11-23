# Deployment Helper Scripts

This directory contains utility scripts to help with deployment and verification.

## Scripts

### `generate-env-template.sh`

Generates environment variable configuration template for Vercel deployment.

**Usage:**
```bash
./scripts/generate-env-template.sh
```

**What it does:**
- Generates a secure `NEXTAUTH_SECRET` using `openssl`
- Displays formatted list of all required environment variables
- Provides guidance on where to obtain each value
- Outputs a template ready to copy into Vercel

**Example output:**
```
DATABASE_URL=
  → Get from Supabase: Project Settings → Database → Connection Pooling

NEXTAUTH_SECRET=yq8fy7fXy0+ut2LG8rNYds6NGXnam9eqtJt+7GnJEq0=
  → Generated above (keep this secure!)

NEXTAUTH_URL=
  → Your Vercel deployment URL
```

### `verify-deployment.sh`

Performs automated checks on a deployed instance and provides manual verification checklist.

**Usage:**
```bash
./scripts/verify-deployment.sh https://your-staging-url.vercel.app
```

**What it does:**
- Checks if the site is reachable (HTTP 200)
- Verifies NextAuth API endpoint responds correctly
- Tests sign-in page accessibility
- Displays comprehensive manual testing checklist

**Example:**
```bash
# Verify staging environment
./scripts/verify-deployment.sh https://calorie-smart-staging.vercel.app

# Verify preview deployment
./scripts/verify-deployment.sh https://calorie-smart-git-feature-branch.vercel.app
```

## Prerequisites

Both scripts require:
- Bash shell (Linux, macOS, WSL on Windows)
- `curl` command (for verification script)
- `openssl` command (for template generator)

These are typically pre-installed on most Unix-based systems.

## Making Scripts Executable

If you get "permission denied" errors, make scripts executable:

```bash
chmod +x scripts/*.sh
```

## Integration with CI/CD

These scripts can be integrated into your CI/CD pipeline:

**GitHub Actions example:**
```yaml
- name: Verify deployment
  run: ./scripts/verify-deployment.sh ${{ steps.deploy.outputs.url }}
```

**Manual verification:**
```bash
# After deploying to Vercel, run:
STAGING_URL=$(vercel ls --json | jq -r '.[0].url')
./scripts/verify-deployment.sh "https://$STAGING_URL"
```

## Customization

Feel free to modify these scripts for your specific needs:

- Add additional environment variables to the template
- Include custom verification checks
- Integrate with your monitoring/alerting system
- Add deployment notifications

## Troubleshooting

**Script not found:**
```bash
# Ensure you're in the project root
cd /path/to/calorie-smart-mvp

# Run with relative path
./scripts/generate-env-template.sh
```

**Permission denied:**
```bash
# Make executable
chmod +x scripts/generate-env-template.sh
chmod +x scripts/verify-deployment.sh
```

**openssl not found:**
```bash
# Install openssl (Ubuntu/Debian)
sudo apt-get install openssl

# Install openssl (macOS)
brew install openssl
```

## Contributing

When adding new deployment-related scripts:

1. Place them in this `scripts/` directory
2. Make them executable: `chmod +x scripts/your-script.sh`
3. Add documentation to this README
4. Include usage examples
5. Handle errors gracefully
6. Use `set -e` to exit on errors

## See Also

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Comprehensive deployment guide
- [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) - Printable checklist
- [VERCEL_SETUP_GUIDE.md](../VERCEL_SETUP_GUIDE.md) - End-to-end setup guide
- [.env.example](../.env.example) - Environment variable reference
