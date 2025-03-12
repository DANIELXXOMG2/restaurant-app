import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Inicializa la base de datos con el esquema SQL definido
 */
export const inicializarDB = async (): Promise<void> => {
  // Configurar conexión a la base de datos
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '../db/schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Conectar y ejecutar las consultas SQL
    const client = await pool.connect();
    try {
      // Dividir y ejecutar las consultas
      const queries = sql.split(';').filter(query => query.trim());
      
      for (const query of queries) {
        if (query.trim()) {
          await client.query(query);
        }
      }
      
      console.log('Base de datos inicializada con éxito');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  } finally {
    // Cerrar el pool de conexiones
    await pool.end();
  }
};

// Ejecutar la inicialización si este archivo se ejecuta directamente
if (require.main === module) {
  inicializarDB()
    .then(() => console.log('Proceso completado'))
    .catch(error => {
      console.error('Error en el proceso:', error);
      process.exit(1);
    });
} 