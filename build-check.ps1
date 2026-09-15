$ErrorActionPreference = 'Stop'
Write-Host "Starting Vite production build..." -ForegroundColor Cyan
$npxExe = (Get-Command npx.exe -ErrorAction SilentlyContinue).Source
if (-not $npxExe) {
    Write-Host "npx not found on PATH" -ForegroundColor Red
    exit 1
}
Write-Host "Using: $npxExe"
& npx vite build 2>&1
$exitCode = $LASTEXITCODE
if ($exitCode -eq 0) {
    Write-Host "`n✅ BUILD PASSED - no errors" -ForegroundColor Green
} else {
    Write-Host "`n❌ BUILD FAILED with exit code $exitCode" -ForegroundColor Red
}
exit $exitCode
