# Tecnologías del Proyecto

Este documento presenta las tecnologías esenciales para desarrollar el aplicativo web de gestión de restaurante.

## Frontend

### React + TypeScript + Vite
- Framework para la interfaz de usuario
- Vite como herramienta de construcción rápida
- TypeScript para tipado estático

### Bibliotecas Clave
- **Tailwind CSS**: Estilos rápidos y responsivos
- **React Hook Form**: Gestión eficiente de formularios CRUD
- **React Query**: Manejo de estado y peticiones al servidor
- **SheetJS**: Generación de reportes en formato XLS

## Backend

### Express + TypeScript
- Framework Node.js para API RESTful
- TypeScript para desarrollo seguro
- Funciones serverless en Vercel

### Dependencias Principales
- **pg (node-postgres)**: Conexión a CockroachDB
- **express**: Enrutamiento y middleware HTTP
- **jsonwebtoken**: Autenticación mediante tokens
- **bcryptjs**: Hash seguro de contraseñas
- **zod**: Validación de datos
- **exceljs**: Generación de reportes Excel
- **CORS**: Permitir acceso desde el frontend

## Base de Datos

### CockroachDB
- Base de datos SQL distribuida compatible con PostgreSQL
- Conexión mediante node-postgres (pg)

## Despliegue

### Vercel
- Plataforma para despliegue del frontend y backend
- Funciones serverless para el backend Node.js/TypeScript

## Estructura del Proyecto

```
restaurant-app/
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes UI
│   │   ├── pages/           # Páginas principales
│   │   └── services/        # Conexión con API
│
├── backend/                 # Express + TypeScript
│   ├── src/
│   │   ├── config/          # Configuración
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Endpoints de API
│   │   ├── middleware/      # Middleware (auth, etc.)
│   │   ├── utils/           # Utilidades (Excel, etc.)
│   │   └── db/              # Esquemas y migración SQL
│
└── vercel.json              # Configuración de despliegue
``` 