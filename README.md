# Restaurante App - Aplicativo Web

Aplicativo web para la gestión de un restaurante de comida rápida, que incluye operaciones CRUD, generación de facturas y reportes de ventas en formato XLS.

## Características Principales

- **Gestión del Menú**: Operaciones CRUD para productos y categorías
- **Sistema de Pedidos**: Registro y seguimiento de pedidos
- **Facturación**: Generación de facturas y actualización de inventario
- **Reportes**: Exportación de reportes de ventas en formato XLS

## Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Backend**: TypeScript + Express
- **Base de Datos**: CockroachDB
- **Despliegue**: Vercel, Azure App Service (Docker)

## Estructura del Proyecto

```
restaurant-app/
├── frontend/                # Interfaz de usuario (React)
├── backend/                 # API REST (Express/TypeScript)
├── db/                      # Esquemas y utilidades de base de datos
├── docker-compose.yml       # Configuración de Docker Compose para despliegue
└── deploy-azure.ps1         # Script de PowerShell para despliegue en Azure
```

## Instalación y Uso

### Requisitos Previos
- Node.js 18+
- Cuenta en CockroachDB
- Cuenta en Vercel o Microsoft Azure

### Configuración del Backend
```bash
cd backend
npm install
npm run dev
```

### Configuración del Frontend
```bash
cd frontend
npm install
npm run dev
```

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:
```
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/basedatos?sslmode=verify-full"
JWT_SECRET="tu_clave_secreta"
JWT_EXPIRATION="24h"
```

## Opciones de Despliegue

### Despliegue en Vercel
1. Conecta el repositorio a Vercel
2. Configura las variables de entorno necesarias:
   - **DATABASE_URL**: Tu URL de conexión a CockroachDB
   - **JWT_SECRET**: Tu clave secreta para autenticación
   - Cualquier otra variable que necesite tu aplicación
3. Para el framework, selecciona "Other"
4. Configura el build command como: `cd frontend && npm install && npm run build`
5. Configura el output directory como: `frontend/dist`
6. Configurar el directorio raíz como: `./`

### Despliegue en Azure App Service con Docker
Para desplegar la aplicación en Azure App Service utilizando Docker Compose:

1. **Preparación**:
   - Asegúrate de tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) y [Azure CLI](https://docs.microsoft.com/es-es/cli/azure/install-azure-cli)
   - Configura las variables de entorno necesarias (puedes usar el archivo `.env.azure.example` como guía)

2. **Despliegue Automático (Recomendado)**:
   ```powershell
   # Ejecuta el script de despliegue automático
   .\deploy-azure.ps1
   ```

3. **Despliegue Manual**:
   - Sigue las instrucciones detalladas en el archivo [AZURE-DEPLOY.md](AZURE-DEPLOY.md)

4. **Verificación**:
   - Una vez desplegada, la aplicación estará disponible en: `https://<nombre-app>.azurewebsites.net`
   - La API estará accesible en: `https://<nombre-app>.azurewebsites.net/api`

### Estructura Serverless
El backend está configurado para funcionar como una función serverless en Vercel:

- El punto de entrada principal está en `/backend/api/index.ts`
- La configuración de redirecciones está en `vercel.json`
- Para probar la API después del despliegue, puedes usar:
  ```bash
  cd backend
  npm run test:vercel https://tu-url-de-vercel.app
  ```

## Licencia
[MIT](LICENSE)