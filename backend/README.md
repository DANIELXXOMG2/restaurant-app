# Restaurant App - Backend

## Descripción

Backend para la aplicación de restaurante desarrollado con Node.js, Express, TypeScript y CockroachDB. Este proyecto proporciona una API RESTful para la gestión de productos, pedidos, usuarios y facturación.

## Requisitos previos

- Node.js (v14 o superior)
- npm (v7 o superior)
- CockroachDB (instalado localmente o acceso a una instancia remota)
- ngrok (para exponer el servidor local a internet)

## Instalación

1. Clona el repositorio
2. Navega a la carpeta del backend
3. Instala las dependencias:

```bash
npm install
```

4. Configura las variables de entorno en un archivo `.env`:

```
# Puerto del servidor
PORT=3000

# Configuración de CockroachDB
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=26257
DB_NAME=restaurant

# Clave secreta para JWT
JWT_SECRET=tu_clave_secreta_jwt_muy_segura_y_larga
JWT_EXPIRATION=24h

# Entorno (development, production)
NODE_ENV=development
```

## Inicialización de la base de datos

Para crear las tablas necesarias en la base de datos, ejecuta:

```bash
npm run init-db
```

## Desarrollo

Para iniciar el servidor en modo desarrollo con recarga automática:

```bash
npm run dev
```

El servidor estará disponible en http://localhost:3000 y si tienes ngrok instalado y configurado, se creará automáticamente un túnel para exponer el servidor a internet.

## Compilación

Para compilar el proyecto TypeScript:

```bash
npm run build
```

El código compilado se guardará en la carpeta `dist`.

## Producción

Para iniciar el servidor en modo producción:

```bash
npm start
```

## Estructura del proyecto

```
backend/
├── src/
│   ├── config/         # Configuración (base de datos, etc.)
│   ├── db/             # Esquema y utilidades de base de datos
│   ├── models/         # Modelos de datos (interfaces TypeScript)
│   ├── routes/         # Endpoints de la API
│   ├── middleware/     # Middleware (autenticación, etc.)
│   ├── utils/          # Utilidades generales
│   └── index.ts        # Punto de entrada de la aplicación
│
├── dist/               # Código compilado
├── .env                # Variables de entorno
├── package.json        # Dependencias y scripts
└── tsconfig.json       # Configuración de TypeScript
```

## Licencia

ISC 