# Test Vercel contact form API
$url = "https://hvac-coral-phi.vercel.app/api/contact"

$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "1234567890"
    message = "This is a test message from automated verification"
    website = ""
} | ConvertTo-Json

Write-Host "Sending test submission to $url..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Status: OK" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ ERROR" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error Message:" -ForegroundColor Yellow
    $_.Exception.Message
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:" -ForegroundColor Yellow
        $responseBody
    }
}
