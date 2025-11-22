#!/bin/bash

# Generate a secure random secret for NEXTAUTH_SECRET
echo "Generating NEXTAUTH_SECRET..."
echo ""
echo "Your new secret:"
openssl rand -base64 32
echo ""
echo "Copy this value and set it as NEXTAUTH_SECRET in your Vercel environment variables."
