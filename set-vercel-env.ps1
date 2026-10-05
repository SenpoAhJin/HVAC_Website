# Set Vercel Environment Variables
# Run this script to configure the contact form API
# NOTE: Replace the placeholder values below with your actual credentials

Write-Host "Setting Vercel environment variables..." -ForegroundColor Cyan

# Set SUPABASE_URL
Write-Host "`nSetting SUPABASE_URL..." -ForegroundColor Yellow
echo "https://xxxxx.supabase.co" | npx vercel env add SUPABASE_URL production

# Set SUPABASE_SECRET_KEY
Write-Host "`nSetting SUPABASE_SECRET_KEY..." -ForegroundColor Yellow
echo "sb_secret_xxxxx..." | npx vercel env add SUPABASE_SECRET_KEY production

# Set IP_HASH_SALT
Write-Host "`nSetting IP_HASH_SALT..." -ForegroundColor Yellow
echo "your-random-salt-string" | npx vercel env add IP_HASH_SALT production

Write-Host "`n✅ Environment variables configured!" -ForegroundColor Green
Write-Host "Run 'npx vercel --prod' to deploy with new configuration" -ForegroundColor Cyan
