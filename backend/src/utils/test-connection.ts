import { config } from 'dotenv';
import { Pool } from 'pg';

// Cargar variables de entorno
config();

async function testDbConnection() {
  console.log('Iniciando prueba de conexión a CockroachDB...');
  
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: No se ha encontrado la variable DATABASE_URL en el archivo .env');
    process.exit(1);
  }
  
  // Mostrar la URL (ocultando la contraseña)
  const visibleUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':******@');
  console.log(`Intentando conectar a: ${visibleUrl}`);
  
  // Configuración de conexión
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // Intentar obtener una conexión del pool
    const client = await pool.connect();
    console.log('✅ Conexión exitosa al pool de conexiones');
    
    // Ejecutar una consulta simple
    const versionResult = await client.query('SELECT version()');
    console.log('✅ Consulta SQL ejecutada correctamente');
    console.log('📊 Versión de la base de datos:', versionResult.rows[0].version);
    
    // Probar que podemos crear una tabla
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS test_connection (
          id SERIAL PRIMARY KEY,
          test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Prueba de creación de tabla exitosa');
      
      // Insertar un registro
      await client.query(`
        INSERT INTO test_connection (test_date) 
        VALUES (CURRENT_TIMESTAMP)
      `);
      console.log('✅ Prueba de inserción exitosa');
      
      // Leer el registro
      const selectResult = await client.query('SELECT * FROM test_connection ORDER BY id DESC LIMIT 1');
      console.log('✅ Prueba de lectura exitosa');
      console.log('📊 Registro leído:', selectResult.rows[0]);
      
    } catch (error) {
      console.error('❌ Error en pruebas de operaciones SQL:', error);
    }
    
    // Liberar el cliente
    client.release();
    console.log('✅ Conexión liberada correctamente');
    
    // Cerrar el pool
    await pool.end();
    console.log('✅ Pool de conexiones cerrado correctamente');
    
    console.log('✅ PRUEBA COMPLETADA: La conexión a CockroachDB funciona correctamente');
    
  } catch (error) {
    console.error('❌ Error al conectar a CockroachDB:', error);
    console.log('❌ PRUEBA FALLIDA: No se pudo conectar a la base de datos');
    
    // Cerrar el pool
    try {
      await pool.end();
    } catch (endError) {
      console.error('Error al cerrar el pool:', endError);
    }
    
    process.exit(1);
  }
}

// Ejecutar la prueba
testDbConnection().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Error inesperado:', error);
  process.exit(1);
}); 