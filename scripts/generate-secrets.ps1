# Generate Secure Secrets for Environment Variables (Windows)
# Usage: .\scripts\generate-secrets.ps1

function Generate-Secret {
    param([int]$Length = 32)
    $bytes = New-Object byte[] $Length
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

Write-Host "🔐 Generating Secure Secrets" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Copy these values to your .env files:" -ForegroundColor Green
Write-Host ""

Write-Host "# JWT Secrets (Backend)" -ForegroundColor Yellow
Write-Host "JWT_SECRET=`"$(Generate-Secret 32)`""
Write-Host "JWT_REFRESH_SECRET=`"$(Generate-Secret 32)`""
Write-Host ""

Write-Host "# NextAuth Secret (Frontend)" -ForegroundColor Yellow
Write-Host "NEXTAUTH_SECRET=`"$(Generate-Secret 32)`""
Write-Host ""

Write-Host "# Database Password" -ForegroundColor Yellow
Write-Host "DB_PASSWORD=`"$(Generate-Secret 24)`""
Write-Host ""

Write-Host "# Session Secret" -ForegroundColor Yellow
Write-Host "SESSION_SECRET=`"$(Generate-Secret 32)`""
Write-Host ""

Write-Host "==============================" -ForegroundColor Cyan
Write-Host "⚠️  IMPORTANT:" -ForegroundColor Red
Write-Host "  1. Never commit these secrets to Git"
Write-Host "  2. Store them in GitHub Secrets for CI/CD"
Write-Host "  3. Use different secrets for staging and production"
Write-Host "  4. Rotate secrets regularly (every 90 days)"
Write-Host ""

