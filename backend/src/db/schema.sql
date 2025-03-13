-- Crear base de datos (ejecutar solo una vez)
-- CREATE DATABASE IF NOT EXISTS restaurant;

-- Usar la base de datos
-- USE restaurant;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
  imagen_url VARCHAR(255),
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255)
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categoria_id INT REFERENCES categorias(id),
  imagen_url VARCHAR(255),
  disponible BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  total DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  direccion_entrega VARCHAR(255)
);

-- Tabla de detalles de pedido
CREATE TABLE IF NOT EXISTS detalles_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INT REFERENCES productos(id),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
  id SERIAL PRIMARY KEY,
  pedido_id INT UNIQUE REFERENCES pedidos(id),
  fecha_emision TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  numero_factura VARCHAR(50) NOT NULL UNIQUE,
  subtotal DECIMAL(10, 2) NOT NULL,
  impuestos DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_detalles_pedido ON detalles_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_facturas_pedido ON facturas(pedido_id);

-- Datos iniciales para categorías
INSERT INTO categorias (nombre, descripcion) 
VALUES 
  ('Entradas', 'Platos para comenzar la comida'),
  ('Platos principales', 'Platos fuertes para disfrutar'),
  ('Postres', 'Dulces para finalizar la comida'),
  ('Bebidas', 'Refrescos y bebidas varias')
ON CONFLICT (nombre) DO NOTHING; 