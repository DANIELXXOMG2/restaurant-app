import { config } from 'dotenv';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';

// Solo cargar el archivo .env si existe y no estamos en producción
if (process.env.NODE_ENV !== 'production' && fs.existsSync(path.resolve(__dirname, '../../.env'))) {
  config({ path: path.resolve(__dirname, '../../.env') });
}

// Verificar que la URL de conexión existe
if (!process.env.DATABASE_URL) {
  console.error('ERROR: No se encontró la variable DATABASE_URL');
  process.exit(1);
}

// Mostrar URL (ocultando credenciales)
const visibleUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':******@');
console.log('Intentando conectar a CockroachDB:', visibleUrl);

// Configuración para la conexión a CockroachDB
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  // Para CockroachDB Cloud, necesitamos SSL
  ssl: true
};

// Crear pool de conexiones
export const pool = new Pool(dbConfig);

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    console.log('Conexión a CockroachDB establecida correctamente');
    console.log('Versión de CockroachDB:', result.rows[0].version);
    client.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a CockroachDB:', error);
    return false;
  }
}; 