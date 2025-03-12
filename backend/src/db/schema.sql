-- Crear tablas para el sistema de gestión de restaurante

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'cliente', -- admin, cliente
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla categorías
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT
);

-- Tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categoria_id INT REFERENCES categorias(id),
  imagen VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente, completado, cancelado
  total DECIMAL(10, 2) NOT NULL DEFAULT 0
);

-- Tabla detalles_pedido
CREATE TABLE IF NOT EXISTS detalles_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INT REFERENCES productos(id),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- Datos iniciales

-- Categorías iniciales
INSERT INTO categorias (nombre, descripcion)
VALUES
  ('Hamburguesas', 'Deliciosas hamburguesas gourmet'),
  ('Pizzas', 'Pizzas con masa artesanal'),
  ('Bebidas', 'Refrescos y bebidas alcohólicas'),
  ('Postres', 'Postres caseros')
ON CONFLICT (nombre) DO NOTHING;

-- Usuario administrador inicial
INSERT INTO usuarios (nombre, email, password, rol)
VALUES (
  'Admin',
  'admin@restaurante.com',
  '$2a$10$i8tYW.aQJlPmjmKGb9Z4T.yIGIuQcJ3FfM9ibvtq7t7Hfgpw7i0qa', -- password: admin123
  'admin'
)
ON CONFLICT (email) DO NOTHING; 