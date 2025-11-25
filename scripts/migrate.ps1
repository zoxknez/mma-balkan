# Database Migration Script for Windows
# Run with: .\scripts\migrate.ps1 [migration-name]

param(
  [string]$MigrationName
)

if (-not $MigrationName -and $env:MIGRATION_NAME) {
  $MigrationName = $env:MIGRATION_NAME
}

Write-Host "🗄️  Database Migration Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Set-Location backend

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
  Write-Host "❌ ERROR: DATABASE_URL environment variable is not set" -ForegroundColor Red
  exit 1
}

# Detect environment
if ($env:NODE_ENV -eq "production") {
  Write-Host "🚨 PRODUCTION environment detected" -ForegroundColor Yellow
  $confirm = Read-Host "Are you sure you want to run migrations in PRODUCTION? (yes/no)"
  if ($confirm -ne "yes") {
    Write-Host "Migration cancelled" -ForegroundColor Yellow
    exit 0
  }
}

# Check Prisma schema
Write-Host "📝 Checking Prisma schema..." -ForegroundColor Green
npx prisma validate

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Green
npx prisma generate

# Create migration (dev only)
if ($env:NODE_ENV -ne "production") {
  if (-not $MigrationName) {
    $MigrationName = Read-Host "Enter migration name (leave empty to auto-generate)"
  }

  if (-not $MigrationName) {
    $MigrationName = "local_update_$(Get-Date -Format 'yyyyMMddHHmmss')"
  }

  $MigrationName = $MigrationName -replace '[^a-zA-Z0-9_-]', '-'
  Write-Host "📦 Creating migration '$MigrationName'..." -ForegroundColor Green
  npx prisma migrate dev --name $MigrationName
} else {
  # Production: deploy migrations
  Write-Host "🚀 Deploying migrations to production..." -ForegroundColor Green
  npx prisma migrate deploy
}

# Check migration status
Write-Host "✅ Migration status:" -ForegroundColor Green
npx prisma migrate status

# Optional: Seed database (dev only)
if ($env:NODE_ENV -ne "production") {
  $seed = Read-Host "Do you want to seed the database? (yes/no)"
  if ($seed -eq "yes") {
    Write-Host "🌱 Seeding database..." -ForegroundColor Green
    npm run prisma:seed
  }
}

Write-Host ""
Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify the migration in Prisma Studio: npx prisma studio"
Write-Host "2. Test the application: npm run dev"
Write-Host "3. Run tests: npm run test"

Set-Location ..

