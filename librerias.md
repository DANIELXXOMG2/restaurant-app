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

### Flask (Python)
- Framework ligero para API RESTful
- Funciones serverless en Vercel

### Dependencias Principales
- **SQLAlchemy + Psycopg2**: ORM y conexión a CockroachDB
- **Flask-RESTful**: Estructura para endpoints API
- **PyJWT**: Autenticación mediante tokens
- **openpyxl**: Generación de reportes Excel

## Base de Datos

### CockroachDB
- Base de datos SQL distribuida compatible con PostgreSQL
- Conexión mediante SQLAlchemy y Psycopg2

## Despliegue

### Vercel
- Plataforma para despliegue del frontend y backend
- Funciones serverless para el backend Python

## Estructura del Proyecto

```
restaurant-app/
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes UI
│   │   ├── pages/           # Páginas principales
│   │   └── services/        # Conexión con API
│
├── backend/                 # Flask + Python
│   ├── app/
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Endpoints de API
│   │   └── utils/           # Utilidades (Excel, etc.)
│
└── db/                      # Scripts SQL y utilidades
``` 