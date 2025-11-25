#!/bin/bash

# Generate Secure Secrets for Environment Variables
# Usage: ./scripts/generate-secrets.sh

echo "🔐 Generating Secure Secrets"
echo "=============================="
echo ""

echo "Copy these values to your .env files:"
echo ""

echo "# JWT Secrets (Backend)"
echo "JWT_SECRET=\"$(openssl rand -base64 32)\""
echo "JWT_REFRESH_SECRET=\"$(openssl rand -base64 32)\""
echo ""

echo "# NextAuth Secret (Frontend)"
echo "NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\""
echo ""

echo "# Database Password"
echo "DB_PASSWORD=\"$(openssl rand -base64 24)\""
echo ""

echo "# Session Secret"
echo "SESSION_SECRET=\"$(openssl rand -hex 32)\""
echo ""

echo "=============================="
echo "⚠️  IMPORTANT:"
echo "  1. Never commit these secrets to Git"
echo "  2. Store them in GitHub Secrets for CI/CD"
echo "  3. Use different secrets for staging and production"
echo "  4. Rotate secrets regularly (every 90 days)"
echo ""

