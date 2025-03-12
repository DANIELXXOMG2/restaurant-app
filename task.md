# Tareas Pendientes

## Backend (TypeScript/Express)

### 1. Configuración Inicial
- [x] Estructura básica de la aplicación Express
- [x] Configuración para Vercel serverless
- [x] Conexión con CockroachDB

### 2. Modelos de Datos
- [x] Esquema SQL básico
- [x] Implementar interfaces TypeScript para:
  - [x] Usuarios
  - [x] Categorías
  - [x] Platos/Productos
  - [x] Pedidos
  - [x] Detalles de pedido

### 3. Endpoints API
- [x] Implementar endpoints CRUD:
  - [x] `/api/auth` (registro, login)
  - [x] `/api/productos` (GET, POST, PUT, DELETE)
  - [x] `/api/categorias` (GET, POST, PUT, DELETE)
  - [x] `/api/pedidos` (GET, POST, PUT, DELETE)

### 4. Funcionalidades Especiales
- [x] Generar factura de venta
- [x] Actualizar stock de productos
- [x] Generar reporte de ventas en XLS
- [x] Implementar autenticación JWT

### 5. Seguridad
- [x] Implementar hash seguro de contraseñas con bcrypt
- [x] Protección de rutas mediante middleware
- [x] Validación de datos de entrada en endpoints
- [x] Control de acceso basado en roles (admin/cliente)
- [x] Manejo de tokens expirados
- [x] Implementar CORS para permitir acceso desde el frontend
- [x] Prevención de ataques SQL Injection

## Frontend (React/TypeScript)

### 1. Configuración Inicial
- [x] Estructura del proyecto Vite + React
- [x] Configuración de TailwindCSS
- [x] Conexión a API backend

### 2. Componentes UI
- [x] Diseñar e implementar:
  - [x] Navbar/Header
  - [x] Formulario de login
  - [x] Tarjetas de productos
  - [x] Formularios CRUD
  - [x] Carrito de compras
  - [x] Tabla de pedidos

### 3. Páginas
- [x] Implementar páginas principales:
  - [x] Inicio/Dashboard
  - [x] Gestión de menú
  - [x] Gestión de pedidos
  - [x] Generación de reportes
  - [x] Facturación

### 4. Funcionalidades Especiales
- [x] Visualización de facturas
- [x] Descarga de reportes XLS
- [x] Gestión de estado con React Query

## Despliegue

### 1. Vercel
- [x] Configuración básica de vercel.json
- [x] Configuración de variables de entorno
- [x] Despliegue de prueba
- [ ] Despliegue final

### 2. CockroachDB
- [x] Creación de la base de datos
- [x] Configuración de conexión segura
- [x] Migración inicial del esquema 