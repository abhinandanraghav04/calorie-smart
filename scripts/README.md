# Deployment Scripts

This directory contains helper scripts for deployment and configuration.

## Available Scripts

### `generate-secret.sh`

Generates a cryptographically secure random string for use as `NEXTAUTH_SECRET`.

**Usage:**
```bash
./scripts/generate-secret.sh
```

**Output:**
```
Generating NEXTAUTH_SECRET...

Your new secret:
your-random-secret-here

Copy this value and set it as NEXTAUTH_SECRET in your Vercel environment variables.
```

**Requirements:**
- OpenSSL (pre-installed on most Unix systems)

### `setup-vercel-env.sh`

Interactive script to configure all required environment variables in Vercel via CLI.

**Usage:**
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
cd /home/engine/project
vercel link

# Run the setup script
./scripts/setup-vercel-env.sh
```

**What it does:**
1. Prompts for all required environment variables
2. Validates prerequisites (Vercel CLI, login, project link)
3. Automatically configures variables for Production, Preview, and Development environments
4. Sets appropriate values for each environment

**Environment variables configured:**
- `DATABASE_URL` - Supabase pooled connection
- `DATABASE_DIRECT_URL` - Supabase direct connection
- `NEXTAUTH_URL` - Production URL (with automatic `$VERCEL_URL` for preview)
- `NEXTAUTH_SECRET` - Authentication secret
- `FDC_API_KEY` - USDA FoodData Central API key

**Requirements:**
- Vercel CLI installed (`npm i -g vercel`)
- Logged in to Vercel (`vercel login`)
- Project linked (`vercel link`)
- Bash shell

## Adding New Scripts

When adding new deployment scripts:

1. Make scripts executable: `chmod +x scripts/your-script.sh`
2. Add shebang line: `#!/bin/bash`
3. Include usage documentation in this README
4. Test scripts in clean environment
5. Handle errors gracefully
6. Provide clear output messages

## Troubleshooting

### Permission Denied

If you get a "Permission denied" error:
```bash
chmod +x scripts/generate-secret.sh
chmod +x scripts/setup-vercel-env.sh
```

### Command Not Found: vercel

Install the Vercel CLI:
```bash
npm i -g vercel
```

### Script Fails During Execution

Ensure you have:
- Bash shell (not sh or another shell)
- Required tools installed (openssl, vercel CLI)
- Proper permissions on the script files
- Internet connection for Vercel API calls

## Notes

- Scripts are designed for Unix-based systems (Linux, macOS)
- Windows users should use WSL or Git Bash
- Scripts use non-interactive mode where possible
- All scripts include error handling and validation

For more information, see:
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Comprehensive deployment guide
- [DEPLOYMENT_QUICKSTART.md](../DEPLOYMENT_QUICKSTART.md) - Quick start guide
