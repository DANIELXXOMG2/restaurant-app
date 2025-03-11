# Tareas Pendientes

## Backend (Python/Flask)

### 1. Configuración Inicial
- [x] Estructura básica de la aplicación Flask
- [x] Configuración para Vercel serverless
- [x] Conexión con CockroachDB

### 2. Modelos de Datos
- [x] Esquema SQL básico
- [ ] Implementar modelos SQLAlchemy para:
  - [ ] Usuarios
  - [ ] Categorías
  - [ ] Platos/Productos
  - [ ] Pedidos
  - [ ] Detalles de pedido

### 3. Endpoints API
- [ ] Implementar endpoints CRUD:
  - [ ] `/api/usuarios` (GET, POST, PUT, DELETE)
  - [ ] `/api/categorias` (GET, POST, PUT, DELETE)
  - [ ] `/api/platos` (GET, POST, PUT, DELETE)
  - [ ] `/api/pedidos` (GET, POST, PUT, DELETE)

### 4. Funcionalidades Especiales
- [ ] Generar factura de venta
- [ ] Actualizar stock de productos
- [ ] Generar reporte de ventas en XLS
- [x] Implementar autenticación JWT

### 5. Seguridad
- [x] Implementar hash seguro de contraseñas con bcrypt
- [ ] Protección de rutas mediante decoradores
- [ ] Validación de datos de entrada en endpoints
- [ ] Control de acceso basado en roles (admin/cliente)
- [ ] Manejo de tokens expirados
- [ ] Implementar CORS para permitir acceso desde el frontend
- [ ] Prevención de ataques SQL Injection

## Frontend (React/TypeScript)

### 1. Configuración Inicial
- [x] Estructura del proyecto Vite + React
- [x] Configuración de TailwindCSS
- [x] Conexión a API backend

### 2. Componentes UI
- [x] Diseñar e implementar:
  - [x] Navbar/Header
  - [x] Formulario de login
  - [ ] Tarjetas de productos
  - [ ] Formularios CRUD
  - [ ] Carrito de compras
  - [ ] Tabla de pedidos

### 3. Páginas
- [ ] Implementar páginas principales:
  - [x] Inicio/Dashboard
  - [ ] Gestión de menú
  - [ ] Gestión de pedidos
  - [ ] Generación de reportes
  - [ ] Facturación

### 4. Funcionalidades Especiales
- [ ] Visualización de facturas
- [ ] Descarga de reportes XLS
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