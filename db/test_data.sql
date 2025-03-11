-- test_data.sql
-- Datos de prueba para el sistema de restaurante simplificado

-- Insertar usuarios
INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES
('Admin', 'Sistema', 'admin@restaurante.com', '$2b$12$1jNL9oFBJW6UbSuTYlSL9eRjvb0JiRZ1zQJwwNuJlc2EnEkn.aiYC', 'admin'),
('María', 'López', 'maria@gmail.com', '$2b$12$jb2H7BJ89UTjZDA2e9iYhOuLB.3.pQtCn1QgxRCdZk1CfOqQlE3b.', 'cliente'),
('Carlos', 'Rodríguez', 'carlos@gmail.com', '$2b$12$dHF16SYu.P89GXbSEqNB1euvzCq0AmIbRJULhyL.MAKVFrpPSGvbW', 'cliente');

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion, imagen_url) VALUES
('Hamburguesas', 'Deliciosas hamburguesas de carne y vegetarianas', 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/categorias/hamburguesas.jpg'),
('Pizzas', 'Pizzas con diferentes ingredientes y tamaños', 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/categorias/pizzas.jpg'),
('Bebidas', 'Refrescos, jugos naturales y bebidas calientes', 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/categorias/bebidas.jpg'),
('Postres', 'Deliciosos postres y helados', 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/categorias/postres.jpg');

-- Insertar platos
INSERT INTO platos (nombre, descripcion, precio, categoria_id, imagen_url, disponible) VALUES
('Hamburguesa Clásica', 'Hamburguesa con carne de res, lechuga, tomate y queso', 15000, 1, 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/hamburguesa-clasica.jpg', TRUE),
('Hamburguesa Doble', 'Doble carne, doble queso y tocineta', 25000, 1, 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/hamburguesa-doble.jpg', TRUE),
('Pizza Margarita', 'Pizza con salsa de tomate, queso mozzarella y albahaca', 35000, 2, 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/pizza-margarita.jpg', TRUE),
('Pizza Pepperoni', 'Pizza con pepperoni y queso', 40000, 2, 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/pizza-pepperoni.jpg', TRUE),
('Coca-Cola', 'Refresco de cola 500ml', 5000, 3, 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/coca-cola.jpg', TRUE),
('Jugo Natural', 'Jugo natural de naranja o mandarina', 7000, 3, 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/jugo-natural.jpg', TRUE),
('Helado de Vainilla', 'Helado cremoso de vainilla con toppings', 8000, 4, 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/helado-vainilla.jpg', TRUE);

-- Insertar pedidos
INSERT INTO pedidos (usuario_id, fecha_pedido, estado, direccion_entrega, subtotal, total) VALUES
(2, '2023-03-10 13:30:00', 'entregado', 'Avenida 7 #45-23', 40000.00, 40000.00),
(3, '2023-03-10 14:15:00', 'entregado', NULL, 53000.00, 53000.00),
(2, '2023-03-10 18:45:00', 'entregado', NULL, 65000.00, 65000.00);

-- Insertar detalles de pedidos
INSERT INTO detalles_pedido (pedido_id, plato_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 2, 15000.00, 30000.00),
(1, 5, 2, 5000.00, 10000.00),
(2, 3, 1, 35000.00, 35000.00),
(2, 6, 1, 7000.00, 7000.00),
(2, 7, 1, 8000.00, 8000.00),
(3, 4, 1, 40000.00, 40000.00),
(3, 5, 4, 5000.00, 20000.00),
(3, 7, 1, 8000.00, 8000.00); 