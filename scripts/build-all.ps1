# Construye imágenes Docker usando variables del archivo .env en la raíz
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env"

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
        }
    }
}

$viteApiUrl = $env:VITE_API_URL
if (-not $viteApiUrl) {
    Write-Error "Define VITE_API_URL en el archivo .env de la raíz del proyecto"
}

Write-Host "Building peliculas-service..." -ForegroundColor Cyan
docker build -t "peliculas-service:latest" (Join-Path $root "peliculas-service")

$viteBuildMode = if ($env:VITE_BUILD_MODE) { $env:VITE_BUILD_MODE } else { "qa" }

Write-Host "Building frontend (VITE_API_URL=$viteApiUrl, VITE_BUILD_MODE=$viteBuildMode)..." -ForegroundColor Cyan
docker build -t "cinebook-frontend:latest" `
    --build-arg "VITE_API_URL=$viteApiUrl" `
    --build-arg "VITE_BUILD_MODE=$viteBuildMode" `
    (Join-Path $root "frontend")

Write-Host "Listo. Ejecuta: docker compose up -d" -ForegroundColor Green
