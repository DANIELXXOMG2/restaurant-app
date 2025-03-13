import { pool, testConnection } from '../config/database';

// Función para inicializar la base de datos
export async function initDatabase(): Promise<void> {
  try {
    // Probar la conexión
    const connected = await testConnection();
    if (!connected) {
      throw new Error('No se pudo establecer conexión con la base de datos.');
    }

    console.log('Inicializando base de datos...');

    // Esquema de tablas
    const createTablesSql = `
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

-- Tabla de platos
CREATE TABLE IF NOT EXISTS platos (
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
  metodo_pago VARCHAR(50) NOT NULL DEFAULT 'tarjeta',
  direccion_entrega VARCHAR(255)
);

-- Tabla de detalles de pedido
CREATE TABLE IF NOT EXISTS detalles_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
  plato_id INT REFERENCES platos(id),
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
CREATE INDEX IF NOT EXISTS idx_platos_categoria ON platos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_detalles_pedido ON detalles_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_facturas_pedido ON facturas(pedido_id);
    `;
    
    // Crear las tablas
    await pool.query(createTablesSql);
    console.log('Tablas creadas correctamente.');
    
    // Obtener las categorías existentes
    const categoriasResult = await pool.query('SELECT id, nombre FROM categorias');
    const categoriasExistentes = categoriasResult.rows;
    console.log('Categorías existentes:', categoriasExistentes);
    
    // Mapeo de nombres a IDs
    const categoriasPorNombre: Record<string, string> = {};
    categoriasExistentes.forEach(cat => {
      categoriasPorNombre[cat.nombre] = cat.id;
    });
    
    // Si no existen, insertar categorías
    const categoriasBase = [
      { nombre: 'Entradas', descripcion: 'Platos para comenzar la comida' },
      { nombre: 'Platos principales', descripcion: 'Platos fuertes para disfrutar' },
      { nombre: 'Postres', descripcion: 'Dulces para finalizar la comida' },
      { nombre: 'Bebidas', descripcion: 'Refrescos y bebidas varias' }
    ];
    
    for (const categoria of categoriasBase) {
      if (!categoriasPorNombre[categoria.nombre]) {
        try {
          const result = await pool.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING id', 
            [categoria.nombre, categoria.descripcion]
          );
          categoriasPorNombre[categoria.nombre] = result.rows[0].id;
          console.log(`Categoría "${categoria.nombre}" insertada con ID: ${result.rows[0].id}`);
        } catch (error) {
          console.log(`Advertencia al insertar categoría ${categoria.nombre}:`, error);
        }
      } else {
        console.log(`Categoría "${categoria.nombre}" ya existe con ID: ${categoriasPorNombre[categoria.nombre]}`);
      }
    }
    
    // Insertar platos
    const platos = [
      { 
        nombre: 'Hamburguesa Clásica', 
        descripcion: 'Deliciosa hamburguesa con queso, lechuga y tomate', 
        precio: 15000, 
        stock: 100, 
        categoria_nombre: 'Platos principales', 
        imagen_url: '/imagenes/hamburguesa.jpg', 
        disponible: true
      },
      { 
        nombre: 'Pizza Margarita', 
        descripcion: 'Pizza tradicional italiana con tomate y mozzarella', 
        precio: 28000, 
        stock: 50, 
        categoria_nombre: 'Platos principales', 
        imagen_url: '/imagenes/pizza.jpg', 
        disponible: true
      },
      { 
        nombre: 'Helado de Vainilla', 
        descripcion: 'Cremoso helado de vainilla con trozos de chocolate', 
        precio: 8000, 
        stock: 200, 
        categoria_nombre: 'Postres', 
        imagen_url: '/imagenes/helado-vainilla.jpg', 
        disponible: true
      }
    ];
    
    for (const plato of platos) {
      try {
        const categoriaId = categoriasPorNombre[plato.categoria_nombre];
        if (!categoriaId) {
          console.log(`Advertencia: No se encontró la categoría "${plato.categoria_nombre}" para el plato "${plato.nombre}"`);
          continue;
        }
        
        const existingPlato = await pool.query(
          'SELECT id FROM platos WHERE nombre = $1', 
          [plato.nombre]
        );
        
        if (existingPlato.rows.length === 0) {
          await pool.query(
            'INSERT INTO platos (nombre, descripcion, precio, stock, categoria_id, imagen_url, disponible) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [plato.nombre, plato.descripcion, plato.precio, plato.stock, categoriaId, plato.imagen_url, plato.disponible]
          );
          console.log(`Plato "${plato.nombre}" insertado correctamente.`);
        } else {
          console.log(`Plato "${plato.nombre}" ya existe.`);
        }
      } catch (error) {
        console.log(`Advertencia al insertar plato ${plato.nombre}:`, error);
      }
    }
    
    console.log('Base de datos inicializada correctamente.');

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Si este archivo se ejecuta directamente, inicializar la base de datos
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Proceso de inicialización completado.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error en el proceso de inicialización:', error);
      process.exit(1);
    });
} 