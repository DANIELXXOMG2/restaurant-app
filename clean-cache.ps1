Write-Host "Limpiando caché y optimizando node_modules..." -ForegroundColor Green

# Detener procesos que puedan estar bloqueando archivos
Get-Process | Where-Object { $_.Name -like "*node*" -or $_.Name -like "*npm*" -or $_.Name -like "*pnpm*" -or $_.Name -like "*turbo*" } | ForEach-Object {
    try {
        $_ | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "Proceso $($_.Name) detenido." -ForegroundColor Yellow
    } catch {
        Write-Host "No se pudo detener el proceso $($_.Name)." -ForegroundColor Red
    }
}

# Eliminar directorios de caché
$directories = @(
    "node_modules",
    "packages/*/node_modules",
    ".turbo",
    "packages/*/.turbo"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "Eliminando $dir..." -ForegroundColor Yellow
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Limpiar caché de pnpm
Write-Host "Limpiando caché de pnpm..." -ForegroundColor Yellow
pnpm store prune

# Reinstalar dependencias
Write-Host "Reinstalando dependencias..." -ForegroundColor Yellow
pnpm install

# Verificar tamaño final
Write-Host "Verificando tamaño final..." -ForegroundColor Green
$rootSize = (Get-ChildItem -Path 'node_modules' -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
$backendSize = (Get-ChildItem -Path 'packages/backend/node_modules' -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
$frontendSize = (Get-ChildItem -Path 'packages/frontend/node_modules' -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "Tamaño de node_modules (raíz): $rootSize MB" -ForegroundColor Cyan
Write-Host "Tamaño de packages/backend/node_modules: $backendSize MB" -ForegroundColor Cyan
Write-Host "Tamaño de packages/frontend/node_modules: $frontendSize MB" -ForegroundColor Cyan
Write-Host "Tamaño total: $($rootSize + $backendSize + $frontendSize) MB" -ForegroundColor Cyan

# Verificar estructura
Write-Host "Estructura de dependencias:" -ForegroundColor Green
Write-Host "Backend:" -ForegroundColor Cyan
Get-ChildItem -Path "packages/backend/node_modules" -ErrorAction SilentlyContinue | Where-Object { -not $_.Name.StartsWith(".") } | Select-Object -First 5 | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Cyan }

Write-Host "Frontend:" -ForegroundColor Cyan
Get-ChildItem -Path "packages/frontend/node_modules" -ErrorAction SilentlyContinue | Where-Object { -not $_.Name.StartsWith(".") } | Select-Object -First 5 | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Cyan }

Write-Host "Limpieza completada!" -ForegroundColor Green 