const { Pool } = require('pg');

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Función para ejecutar consultas
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    throw error;
  }
};

// Función para obtener un cliente para transacciones
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

// Exportar funciones y la conexión
module.exports = {
  query,
  getClient,
  pool
}; 