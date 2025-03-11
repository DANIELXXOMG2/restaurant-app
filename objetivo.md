# Aplicativo Web para Gestión de Restaurante

## Objetivo Principal
Desarrollar un pequeño aplicativo web desplegado en VERCEL, con acceso a una base de datos CockRoachDB para la gestión de un restaurante de comida rápida.

## Requisitos Funcionales

### 1. Operaciones CRUD
- Implementar operaciones completas de Crear, Leer, Actualizar y Eliminar para:
  - Gestión de platos/productos del menú
  - Categorías de productos
  - Usuarios del sistema
  - Pedidos de clientes

### 2. Módulo de Facturación
- Generar facturas de venta para los pedidos realizados
- Actualizar automáticamente el stock/disponibilidad de productos
- Mantener un historial de transacciones

### 3. Reportes
- Generar un reporte total de ventas en formato XLS
- Filtrar ventas por fechas y categorías de productos
- Mostrar información detallada de ventas por producto

## Arquitectura Técnica
- **Frontend**: React con TypeScript, desplegado en Vercel
- **Backend**: Python con Flask, implementado como funciones serverless en Vercel
- **Base de Datos**: CockroachDB para almacenamiento persistente
- **Comunicación**: API RESTful entre frontend y backend

## Entregables
1. Aplicación web funcional desplegada en Vercel
2. Código fuente organizado en repositorio GitHub
3. Documentación básica de uso
4. Base de datos configurada en CockroachDB