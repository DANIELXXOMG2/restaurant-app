# Aplicación de Gestión para Restaurante de Comida Rápida

## Descripción General
Sistema web completo para la gestión de un restaurante de comida rápida con ofertas, permitiendo administración del menú, gestión de pedidos y reservas, y generación de informes financieros.

## Objetivos Principales

### 1. Gestión del Menú Dinámico
- **Administración de platos:**
  - Crear, leer, actualizar y eliminar (CRUD) platos del menú.
  - Asignar categorías, precios, y descripción detallada a cada plato.
  - Administrar imágenes de los productos.
- **Gestión de promociones:**
  - Configurar promociones y ofertas diarias/semanales.
  - Establecer precios especiales y condiciones de las ofertas.
  - Programar activación y desactivación automática de promociones.
- **Visibilidad del menú:**
  - Interfaz de usuario atractiva para visualizar el menú.
  - Filtros por categorías, precios y promociones activas.

### 2. Módulo de Pedidos y Reservas
- **Sistema de pedidos online:**
  - Interfaz intuitiva para que los clientes realicen pedidos.
  - Carrito de compras con cálculo automático del total.
  - Opciones de personalización de pedidos.
- **Gestión de reservas:**
  - Reservar mesa para consumo en el local.
  - Programar hora de recogida para pedidos para llevar.
  - Sistema de notificaciones para confirmación de reservas.
- **Control de inventario:**
  - Actualización en tiempo real del stock de ingredientes.
  - Alertas de stock bajo para reabastecimiento.
  - Trazabilidad del uso de ingredientes por pedido.

### 3. Sistema de Facturación e Informes
- **Facturación instantánea:**
  - Generación automática de facturas digitales.
  - Envío de comprobantes por correo electrónico.
  - Registro de métodos de pago utilizados.
- **Informes de ventas:**
  - Exportación de reportes diarios en formato XLS.
  - Filtros por rango de horas, tipo de promoción, categoría de productos.
  - Visualización de gráficos de rendimiento y tendencias de ventas.
- **Panel de análisis:**
  - Métricas clave de desempeño (KPIs) del negocio.
  - Análisis de rentabilidad por producto/promoción.
  - Información sobre preferencias de los clientes.

## Requisitos Técnicos
- Frontend desarrollado en React con TypeScript
- Backend en Python utilizando Flask
- Base de datos relacional para almacenamiento de datos
- API RESTful para comunicación entre frontend y backend
- Diseño responsive para acceso desde dispositivos móviles