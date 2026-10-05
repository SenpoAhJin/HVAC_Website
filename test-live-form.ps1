# Test the LIVE contact form after fix
$url = "https://hvac-coral-phi.vercel.app/api/contact"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$body = @{
    name = "Real Browser Test - $timestamp"
    email = "verified-working@test.com"
    phone = "555-0001"
    message = "This submission proves the live form works end-to-end after fixing the /api/contact.php -> /api/contact URL"
    website = ""
} | ConvertTo-Json

Write-Host "Testing live form at: $url" -ForegroundColor Cyan
Write-Host "Timestamp: $timestamp" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ SUCCESS - Form submission accepted" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json
    Write-Host ""
    Write-Host "Next: Check Supabase leads table for this submission" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}
