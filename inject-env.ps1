$envFile      = ".env"
$templateFile = "js\firebase.template.js"
$outputFile   = "js\firebase.js"

if (-not (Test-Path $envFile))      { Write-Host "ERROR: .env not found" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $templateFile)) { Write-Host "ERROR: firebase.template.js not found" -ForegroundColor Red; exit 1 }

$env = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.+)$') { $env[$Matches[1].Trim()] = $Matches[2].Trim() }
}

$content = Get-Content $templateFile -Raw
$content = $content -replace '__FIREBASE_API_KEY__',    $env["FIREBASE_API_KEY"]
$content = $content -replace '__FIREBASE_PROJECT_ID__', $env["FIREBASE_PROJECT_ID"]

Set-Content -Path $outputFile -Value $content -Encoding utf8 -NoNewline
Write-Host "OK: js/firebase.js created from template" -ForegroundColor Green
