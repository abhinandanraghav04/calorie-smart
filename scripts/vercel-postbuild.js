#!/usr/bin/env node

// Vercel post-build script for Prisma migrations
const { execSync } = require('child_process');

console.log('Running Prisma generate...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma generate completed successfully');
} catch (error) {
  console.error('Prisma generate failed:', error);
  process.exit(1);
}