#!/bin/bash

# Database Migration Script
# This script handles Prisma migrations safely

MIGRATION_NAME=${1:-${MIGRATION_NAME}}

set -e  # Exit on error

echo "🗄️  Database Migration Script"
echo "================================"

cd backend

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

# Detect environment
if [ "$NODE_ENV" = "production" ]; then
  echo "🚨 PRODUCTION environment detected"
  read -p "Are you sure you want to run migrations in PRODUCTION? (yes/no): " confirm
  if [ "$confirm" != "yes" ]; then
    echo "Migration cancelled"
    exit 0
  fi
fi

# Check Prisma schema
echo "📝 Checking Prisma schema..."
npx prisma validate

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create migration (dev only)
if [ "$NODE_ENV" != "production" ]; then
  if [ -z "$MIGRATION_NAME" ]; then
    read -p "Enter migration name (leave empty to auto-generate): " MIGRATION_NAME
  fi

  if [ -z "$MIGRATION_NAME" ]; then
    MIGRATION_NAME="local_update_$(date +%Y%m%d%H%M%S)"
  fi

  MIGRATION_NAME=$(echo "$MIGRATION_NAME" | tr -cd '[:alnum:]_-')
  echo "📦 Creating migration '$MIGRATION_NAME'..."
  npx prisma migrate dev --name "$MIGRATION_NAME"
else
  # Production: deploy migrations
  echo "🚀 Deploying migrations to production..."
  npx prisma migrate deploy
fi

# Check migration status
echo "✅ Migration status:"
npx prisma migrate status

# Optional: Seed database (dev only)
if [ "$NODE_ENV" != "production" ]; then
  read -p "Do you want to seed the database? (yes/no): " seed
  if [ "$seed" = "yes" ]; then
    echo "🌱 Seeding database..."
    npm run prisma:seed
  fi
fi

echo ""
echo "✅ Migration completed successfully!"
echo ""
echo "Next steps:"
echo "1. Verify the migration in Prisma Studio: npx prisma studio"
echo "2. Test the application: npm run dev"
echo "3. Run tests: npm run test"

