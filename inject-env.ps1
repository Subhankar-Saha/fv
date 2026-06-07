# Reads .env and injects Firebase values into js/firebase.js for local development
$envFile = ".env"
$target  = "js\firebase.js"

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env file not found" -ForegroundColor Red
    exit 1
}

$env = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
        $env[$Matches[1].Trim()] = $Matches[2].Trim()
    }
}

$content = @"
export const FIREBASE_API_KEY    = '$($env["FIREBASE_API_KEY"])';
export const FIREBASE_PROJECT_ID = '$($env["FIREBASE_PROJECT_ID"])';
"@

Set-Content -Path $target -Value $content -Encoding utf8
Write-Host "OK: firebase.js updated for local dev" -ForegroundColor Green
Write-Host "NOTE: Do NOT commit this change - git tracks the placeholder version" -ForegroundColor Yellow
