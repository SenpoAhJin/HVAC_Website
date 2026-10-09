#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Live site verification script for GreenGeeks deployment
.DESCRIPTION
    READ-ONLY verification - does NOT submit real form data or write to database
.PARAMETER Domain
    The domain to verify (default: https://premiertechsolution.us)
#>

param(
    [string]$Domain = "https://premiertechsolution.us"
)

$ErrorActionPreference = 'SilentlyContinue'
$results = @()
$passed = 0
$failed = 0

function Test-Check {
    param($Name, $Result, $Details = "")
    if ($Result) {
        Write-Host "✅ PASS: $Name" -ForegroundColor Green
        $script:passed++
        $script:results += [PSCustomObject]@{ Check = $Name; Result = "PASS"; Details = $Details }
    } else {
        Write-Host "❌ FAIL: $Name" -ForegroundColor Red
        if ($Details) { Write-Host "   $Details" -ForegroundColor Yellow }
        $script:failed++
        $script:results += [PSCustomObject]@{ Check = $Name; Result = "FAIL"; Details = $Details }
    }
}

Write-Host "=== Live Site Verification ===" -ForegroundColor Cyan
Write-Host "Domain: $Domain`n" -ForegroundColor Cyan

# Check 1: Main pages return 200
Write-Host "Checking main pages..." -ForegroundColor Yellow
$pages = @('/', '/services', '/about', '/contact')
foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "$Domain$page" -UseBasicParsing -TimeoutSec 10
        $hasRoot = $response.Content -match 'id="?root"?' -or $response.Content -match 'react'
        Test-Check "GET $page returns 200" ($response.StatusCode -eq 200 -and $hasRoot) "Status: $($response.StatusCode)"
    } catch {
        Test-Check "GET $page returns 200" $false "Error: $($_.Exception.Message)"
    }
}

# Check 2: HTTPS works and HTTP redirects
Write-Host "`nChecking HTTPS..." -ForegroundColor Yellow
try {
    $httpsResponse = Invoke-WebRequest -Uri $Domain -UseBasicParsing -TimeoutSec 10
    Test-Check "HTTPS works" ($httpsResponse.StatusCode -eq 200) "Status: $($httpsResponse.StatusCode)"
} catch {
    Test-Check "HTTPS works" $false "Error: $($_.Exception.Message)"
}

if ($Domain -match '^https://(.+)$') {
    $httpDomain = "http://$($matches[1])"
    try {
        $httpResponse = Invoke-WebRequest -Uri $httpDomain -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
        $redirects = $httpResponse.StatusCode -eq 301 -and $httpResponse.Headers.Location -match '^https://'
        Test-Check "HTTP redirects to HTTPS" $redirects "Status: $($httpResponse.StatusCode), Location: $($httpResponse.Headers.Location)"
    } catch {
        # A redirect exception means it's working
        if ($_.Exception.Response.StatusCode -eq 301) {
            Test-Check "HTTP redirects to HTTPS" $true "301 redirect"
        } else {
            Test-Check "HTTP redirects to HTTPS" $false "No redirect found"
        }
    }
}

# Check 3: API endpoint security
Write-Host "`nChecking API security..." -ForegroundColor Yellow
try {
    $getResponse = Invoke-WebRequest -Uri "$Domain/api/contact.php" -Method GET -UseBasicParsing -TimeoutSec 10
    Test-Check "GET /api/contact.php returns 405" ($getResponse.StatusCode -eq 405) "Status: $($getResponse.StatusCode)"
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    Test-Check "GET /api/contact.php returns 405" ($status -eq 405) "Status: $status"
}

try {
    $invalidJson = Invoke-WebRequest -Uri "$Domain/api/contact.php" -Method POST -Body "invalid json" -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
    Test-Check "POST invalid JSON returns 400" ($invalidJson.StatusCode -eq 400) "Status: $($invalidJson.StatusCode)"
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    Test-Check "POST invalid JSON returns 400" ($status -eq 400) "Status: $status"
}

try {
    $keepaliveResponse = Invoke-WebRequest -Uri "$Domain/api/keepalive.php" -UseBasicParsing -TimeoutSec 10
    $isEmpty = $keepaliveResponse.Content.Length -eq 0 -or $keepaliveResponse.Content -eq '1'
    Test-Check "GET /api/keepalive.php blocked" $isEmpty "Content length: $($keepaliveResponse.Content.Length)"
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    Test-Check "GET /api/keepalive.php blocked" ($status -eq 403 -or $status -eq 404) "Status: $status"
}

# Check 4: SEO files
Write-Host "`nChecking SEO files..." -ForegroundColor Yellow
try {
    $sitemapResponse = Invoke-WebRequest -Uri "$Domain/sitemap.xml" -UseBasicParsing -TimeoutSec 10
    $hasDomain = $sitemapResponse.Content -match 'premiertechsolution\.us'
    Test-Check "/sitemap.xml exists and mentions domain" ($sitemapResponse.StatusCode -eq 200 -and $hasDomain) ""
} catch {
    Test-Check "/sitemap.xml exists" $false "Error: $($_.Exception.Message)"
}

try {
    $robotsResponse = Invoke-WebRequest -Uri "$Domain/robots.txt" -UseBasicParsing -TimeoutSec 10
    $hasDomain = $robotsResponse.Content -match 'premiertechsolution\.us'
    Test-Check "/robots.txt exists and mentions domain" ($robotsResponse.StatusCode -eq 200 -and $hasDomain) ""
} catch {
    Test-Check "/robots.txt exists" $false "Error: $($_.Exception.Message)"
}

# Check 5: Security - blocked paths
Write-Host "`nChecking security blocks..." -ForegroundColor Yellow
$blockedPaths = @('/private_config/', '/api/config.sample.php', '/.env')
foreach ($path in $blockedPaths) {
    try {
        $response = Invoke-WebRequest -Uri "$Domain$path" -UseBasicParsing -TimeoutSec 10
        Test-Check "$path blocked" $false "Got status $($response.StatusCode) - should be 403/404"
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        $isBlocked = $status -eq 403 -or $status -eq 404
        Test-Check "$path blocked" $isBlocked "Status: $status"
    }
}

# Summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })

if ($failed -eq 0) {
    Write-Host "`n✅ All checks passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n❌ Some checks failed. Review errors above." -ForegroundColor Red
    exit 1
}
