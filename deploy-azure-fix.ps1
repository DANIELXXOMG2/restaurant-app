#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Script para desplegar la aplicación Restaurant App en Azure App Service con Docker Compose.
.DESCRIPTION
    Este script automatiza el despliegue completo de la aplicación en Azure App Service,
    incluyendo la creación de recursos, configuración de variables de entorno y despliegue
    de los contenedores Docker.
.NOTES
    Autor: Restaurant App Team
    Versión: 1.1
#>

# Configuración de colores para mejor legibilidad
$colorInfo = "Cyan"
$colorSuccess = "Green"
$colorWarning = "Yellow"
$colorError = "Red"

# Función para mostrar mensajes con formato
function Write-ColoredOutput {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$false)]
        [string]$Color = "White"
    )
    
    Write-Host $Message -ForegroundColor $Color
}

# Banner de inicio
Clear-Host
Write-ColoredOutput "=========================================================" $colorInfo
Write-ColoredOutput "      DESPLIEGUE DE RESTAURANT APP EN AZURE              " $colorInfo
Write-ColoredOutput "=========================================================" $colorInfo
Write-ColoredOutput " " $colorInfo

# Verificar requisitos previos
Write-ColoredOutput "Verificando requisitos previos..." $colorInfo

# Verificar Docker
try {
    docker --version | Out-Null
    Write-ColoredOutput "✓ Docker está instalado" $colorSuccess
} catch {
    Write-ColoredOutput "✗ Error: Docker no está instalado o no está en ejecución" $colorError
    Write-ColoredOutput "  Por favor, instala Docker Desktop desde: https://www.docker.com/products/docker-desktop/" $colorInfo
    exit 1
}

# Verificar Azure CLI
try {
    az --version | Out-Null
    Write-ColoredOutput "✓ Azure CLI está instalado" $colorSuccess
} catch {
    Write-ColoredOutput "✗ Error: Azure CLI no está instalado" $colorError
    Write-ColoredOutput "  Por favor, instala Azure CLI desde: https://docs.microsoft.com/es-es/cli/azure/install-azure-cli" $colorInfo
    exit 1
}

# Verificar inicio de sesión en Azure
$loginStatus = az account show 2>$null
if (-not $loginStatus) {
    Write-ColoredOutput "Necesitas iniciar sesión en Azure..." $colorWarning
    az login
}
Write-ColoredOutput "✓ Sesión iniciada en Azure" $colorSuccess

# Solicitar información del despliegue
Write-ColoredOutput "`nConfigurando el despliegue..." $colorInfo

# Solicitar y validar el nombre de la aplicación
do {
    $appName = Read-Host "Nombre de la aplicación (solo letras minúsculas, números y guiones)"
    
    # Validar el formato del nombre
    $isValid = $appName -match "^[a-z0-9]([a-z0-9-]{0,58}[a-z0-9])?$"
    
    if (-not $isValid) {
        Write-ColoredOutput "✗ Nombre de aplicación inválido. El nombre debe:" $colorError
        Write-ColoredOutput "  - Contener solo letras minúsculas, números o guiones (-)" $colorError
        Write-ColoredOutput "  - Comenzar y terminar con una letra o número" $colorError
        Write-ColoredOutput "  - Tener entre 2 y 60 caracteres" $colorError
        Write-ColoredOutput "Por favor, intenta con otro nombre." $colorWarning
    }
} while (-not $isValid)

# Verificar y sugerir regiones disponibles
Write-ColoredOutput "`nVerificando regiones disponibles..." $colorInfo
Write-ColoredOutput "Esto puede tardar unos segundos..." $colorInfo

# Verificar si el proveedor Microsoft.Web está registrado
$providerStatus = az provider show --namespace Microsoft.Web --query "registrationState" -o tsv 2>$null
if ($providerStatus -ne "Registered") {
    Write-ColoredOutput "⚠ El proveedor Microsoft.Web no está registrado. Registrando ahora..." $colorWarning
    az provider register --namespace Microsoft.Web
    Write-ColoredOutput "El proveedor Microsoft.Web se está registrando. Este proceso puede tardar unos minutos." $colorInfo
    Write-ColoredOutput "Por favor, ejecuta el script nuevamente en unos minutos." $colorInfo
    exit 0
}

# Sugerir regiones recomendadas
$regionOptions = @(
    @{Number = "1"; Name = "westeurope"; Description = "Europa Occidental (Países Bajos)"},
    @{Number = "2"; Name = "eastus"; Description = "Este de EE. UU. (Virginia)"},
    @{Number = "3"; Name = "westus"; Description = "Oeste de EE. UU. (California)"},
    @{Number = "4"; Name = "centralus"; Description = "Centro de EE. UU. (Iowa)"},
    @{Number = "5"; Name = "southcentralus"; Description = "Centro-sur de EE. UU. (Texas)"}
)

Write-ColoredOutput "`nRegiones recomendadas:" $colorInfo
foreach ($region in $regionOptions) {
    Write-ColoredOutput "$($region.Number). $($region.Name) - $($region.Description)" $colorInfo
}

Write-ColoredOutput "`nPuedes elegir el número de la región (1-5) o escribir el nombre completo de la región" $colorInfo
$locationInput = Read-Host "Región de Azure"

# Convertir la entrada a nombre de región si es un número
$location = $locationInput
foreach ($region in $regionOptions) {
    if ($locationInput -eq $region.Number) {
        $location = $region.Name
        break
    }
}

Write-ColoredOutput "Usando región: $location" $colorInfo

$resourceGroup = "$appName-rg"
$appServicePlan = "$appName-plan"

# Verificar si hay variables de entorno configuradas
if (-not $env:DATABASE_URL) {
    Write-ColoredOutput "`n⚠ ADVERTENCIA: No se encontró la variable de entorno DATABASE_URL" $colorWarning
    $dbUrl = Read-Host "Introduce la URL de conexión a la base de datos"
    $env:DATABASE_URL = $dbUrl
}

if (-not $env:JWT_SECRET) {
    Write-ColoredOutput "⚠ ADVERTENCIA: No se encontró la variable de entorno JWT_SECRET" $colorWarning
    $jwtSecret = Read-Host "Introduce una clave secreta JWT"
    $env:JWT_SECRET = $jwtSecret
}

if (-not $env:JWT_EXPIRATION) {
    $env:JWT_EXPIRATION = "24h"
    Write-ColoredOutput "ℹ Se ha configurado JWT_EXPIRATION con valor predeterminado: 24h" $colorInfo
}

# Crear grupo de recursos
Write-ColoredOutput "`nCreando grupo de recursos '$resourceGroup'..." $colorInfo
$resourceGroupCreated = $false
try {
    $output = az group create --name $resourceGroup --location $location
    if ($output) {
        Write-ColoredOutput "✓ Grupo de recursos creado correctamente" $colorSuccess
        $resourceGroupCreated = $true
    } else {
        Write-ColoredOutput "✗ Error al crear el grupo de recursos" $colorError
        exit 1
    }
} catch {
    Write-ColoredOutput "✗ Error al crear el grupo de recursos: $_" $colorError
    exit 1
}

if (-not $resourceGroupCreated) {
    Write-ColoredOutput "✗ No se pudo crear el grupo de recursos. Revisa la región especificada." $colorError
    exit 1
}

# Crear plan de App Service
Write-ColoredOutput "`nCreando plan de App Service '$appServicePlan'..." $colorInfo

# Preguntar por el SKU (tier) a utilizar
Write-ColoredOutput "Selecciona el tier de App Service:" $colorInfo
Write-ColoredOutput "1. F1 - Free (recomendado para pruebas)" $colorInfo
Write-ColoredOutput "2. B1 - Basic" $colorInfo
Write-ColoredOutput "3. S1 - Standard" $colorInfo
$skuOption = Read-Host "Opción (1-3)"

switch ($skuOption) {
    "2" { $sku = "B1" }
    "3" { $sku = "S1" }
    default { $sku = "F1" } # Opción 1 o cualquier entrada inválida
}

Write-ColoredOutput "Usando SKU: $sku" $colorInfo

$appServicePlanCreated = $false
try {
    $output = az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku $sku --is-linux
    if ($output) {
        Write-ColoredOutput "✓ Plan de App Service creado correctamente" $colorSuccess
        $appServicePlanCreated = $true
    } else {
        Write-ColoredOutput "✗ Error al crear el plan de App Service" $colorError
        Write-ColoredOutput "Eliminando grupo de recursos para evitar cargos..." $colorWarning
        az group delete --name $resourceGroup --yes --no-wait
        exit 1
    }
} catch {
    Write-ColoredOutput "✗ Error al crear el plan de App Service: $_" $colorError
    Write-ColoredOutput "Eliminando grupo de recursos para evitar cargos..." $colorWarning
    az group delete --name $resourceGroup --yes --no-wait
    exit 1
}

if (-not $appServicePlanCreated) {
    Write-ColoredOutput "✗ No se pudo crear el plan de App Service." $colorError
    Write-ColoredOutput "  Es posible que tu suscripción no tenga cuota disponible en esta región o para este SKU." $colorError
    Write-ColoredOutput "  Intenta con una región diferente o un SKU más básico." $colorInfo
    Write-ColoredOutput "Eliminando grupo de recursos para evitar cargos..." $colorWarning
    az group delete --name $resourceGroup --yes --no-wait
    exit 1
}

# Verificar que el archivo docker-compose.yml existe
if (-not (Test-Path "docker-compose.yml")) {
    Write-ColoredOutput "✗ Error: No se encontró el archivo docker-compose.yml en el directorio actual" $colorError
    Write-ColoredOutput "  Asegúrate de ejecutar este script desde el directorio raíz del proyecto" $colorInfo
    Write-ColoredOutput "Eliminando recursos creados para evitar cargos..." $colorWarning
    az group delete --name $resourceGroup --yes --no-wait
    exit 1
}

# Crear Web App para contenedores
Write-ColoredOutput "`nCreando Web App '$appName'..." $colorInfo
$webAppCreated = $false
try {
    $output = az webapp create --resource-group $resourceGroup --plan $appServicePlan --name $appName --multicontainer-config-type compose --multicontainer-config-file docker-compose.yml
    if ($output) {
        Write-ColoredOutput "✓ Web App creada correctamente" $colorSuccess
        $webAppCreated = $true
    } else {
        Write-ColoredOutput "✗ Error al crear la Web App" $colorError
        Write-ColoredOutput "Eliminando grupo de recursos para evitar cargos..." $colorWarning
        az group delete --name $resourceGroup --yes --no-wait
        exit 1
    }
} catch {
    Write-ColoredOutput "✗ Error al crear la Web App: $_" $colorError
    Write-ColoredOutput "Eliminando grupo de recursos para evitar cargos..." $colorWarning
    az group delete --name $resourceGroup --yes --no-wait
    exit 1
}

if (-not $webAppCreated) {
    Write-ColoredOutput "✗ No se pudo crear la Web App." $colorError
    Write-ColoredOutput "Eliminando grupo de recursos para evitar cargos..." $colorWarning
    az group delete --name $resourceGroup --yes --no-wait
    exit 1
}

# Configurar variables de entorno
Write-ColoredOutput "`nConfigurando variables de entorno..." $colorInfo
$envVarsConfigured = $false
try {
    $output = az webapp config appsettings set --resource-group $resourceGroup --name $appName --settings DATABASE_URL="$env:DATABASE_URL" JWT_SECRET="$env:JWT_SECRET" JWT_EXPIRATION="$env:JWT_EXPIRATION" WEBSITES_PORT=80
    if ($output) {
        Write-ColoredOutput "✓ Variables de entorno configuradas correctamente" $colorSuccess
        $envVarsConfigured = $true
    } else {
        Write-ColoredOutput "✗ Error al configurar variables de entorno" $colorError
        Write-ColoredOutput "Es posible que la aplicación no funcione correctamente." $colorWarning
    }
} catch {
    Write-ColoredOutput "✗ Error al configurar variables de entorno: $_" $colorError
    Write-ColoredOutput "Es posible que la aplicación no funcione correctamente." $colorWarning
}

# Reiniciar aplicación para aplicar cambios
Write-ColoredOutput "`nReiniciando aplicación..." $colorInfo
try {
    az webapp restart --name $appName --resource-group $resourceGroup
    Write-ColoredOutput "✓ Aplicación reiniciada correctamente" $colorSuccess
} catch {
    Write-ColoredOutput "✗ Error al reiniciar la aplicación: $_" $colorError
    Write-ColoredOutput "Es posible que necesites reiniciar manualmente la aplicación." $colorWarning
}

# Obtener URL de la aplicación
$appUrl = "https://$appName.azurewebsites.net"
Write-ColoredOutput "`n¡Despliegue completado con éxito!" $colorSuccess
Write-ColoredOutput "La aplicación está disponible en: $appUrl" $colorInfo
Write-ColoredOutput "El despliegue inicial puede tardar unos minutos en estar disponible." $colorInfo

# Abrir en el navegador
Write-ColoredOutput "`n¿Deseas abrir la aplicación en el navegador? (S/N)" $colorInfo
$openBrowser = Read-Host
if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Start-Process $appUrl
}

Write-ColoredOutput "`nComandos útiles para gestionar tu aplicación:" $colorInfo
Write-ColoredOutput "  - Ver logs: az webapp log tail --name $appName --resource-group $resourceGroup" $colorInfo
Write-ColoredOutput "  - Reiniciar: az webapp restart --name $appName --resource-group $resourceGroup" $colorInfo
Write-ColoredOutput "  - Eliminar todos los recursos: az group delete --name $resourceGroup --yes" $colorInfo

Write-ColoredOutput "`n¡Gracias por usar Restaurant App!" $colorSuccess 