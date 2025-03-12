import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // En producción debe ser true, solo para desarrollo
  }
});

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Conexión exitosa a la base de datos:', result.rows[0]);
    client.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return false;
  }
};

export default pool; 