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
- **Despliegue**: Vercel

## Estructura del Proyecto

```
restaurant-app/
├── frontend/                # Interfaz de usuario (React)
├── backend/                 # API REST (Express/TypeScript)
└── db/                      # Esquemas y utilidades de base de datos
```

## Instalación y Uso

### Requisitos Previos
- Node.js 18+
- Cuenta en CockroachDB
- Cuenta en Vercel

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
SECRET_KEY="tu_clave_secreta"
```

## Despliegue

### En Vercel
1. Conecta el repositorio a Vercel
2. Configura las variables de entorno
3. Para el framework, selecciona "Other"
4. Configura el build command como: `cd frontend && npm install && npm run build`
5. Configura el output directory como: `frontend/dist`
6. Configurar el directorio raíz como: `./`

## Licencia
[MIT](LICENSE)