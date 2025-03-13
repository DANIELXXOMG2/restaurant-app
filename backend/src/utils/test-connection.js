"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const pg_1 = require("pg");
// Cargar variables de entorno
(0, dotenv_1.config)();
function testDbConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Iniciando prueba de conexión a CockroachDB...');
        if (!process.env.DATABASE_URL) {
            console.error('ERROR: No se ha encontrado la variable DATABASE_URL en el archivo .env');
            process.exit(1);
        }
        // Mostrar la URL (ocultando la contraseña)
        const visibleUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':******@');
        console.log(`Intentando conectar a: ${visibleUrl}`);
        // Configuración de conexión
        const pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        try {
            // Intentar obtener una conexión del pool
            const client = yield pool.connect();
            console.log('✅ Conexión exitosa al pool de conexiones');
            // Ejecutar una consulta simple
            const versionResult = yield client.query('SELECT version()');
            console.log('✅ Consulta SQL ejecutada correctamente');
            console.log('📊 Versión de la base de datos:', versionResult.rows[0].version);
            // Probar que podemos crear una tabla
            try {
                yield client.query(`
        CREATE TABLE IF NOT EXISTS test_connection (
          id SERIAL PRIMARY KEY,
          test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
                console.log('✅ Prueba de creación de tabla exitosa');
                // Insertar un registro
                yield client.query(`
        INSERT INTO test_connection (test_date) 
        VALUES (CURRENT_TIMESTAMP)
      `);
                console.log('✅ Prueba de inserción exitosa');
                // Leer el registro
                const selectResult = yield client.query('SELECT * FROM test_connection ORDER BY id DESC LIMIT 1');
                console.log('✅ Prueba de lectura exitosa');
                console.log('📊 Registro leído:', selectResult.rows[0]);
            }
            catch (error) {
                console.error('❌ Error en pruebas de operaciones SQL:', error);
            }
            // Liberar el cliente
            client.release();
            console.log('✅ Conexión liberada correctamente');
            // Cerrar el pool
            yield pool.end();
            console.log('✅ Pool de conexiones cerrado correctamente');
            console.log('✅ PRUEBA COMPLETADA: La conexión a CockroachDB funciona correctamente');
        }
        catch (error) {
            console.error('❌ Error al conectar a CockroachDB:', error);
            console.log('❌ PRUEBA FALLIDA: No se pudo conectar a la base de datos');
            // Cerrar el pool
            try {
                yield pool.end();
            }
            catch (endError) {
                console.error('Error al cerrar el pool:', endError);
            }
            process.exit(1);
        }
    });
}
// Ejecutar la prueba
testDbConnection().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('Error inesperado:', error);
    process.exit(1);
});
