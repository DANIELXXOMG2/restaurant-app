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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.pool = void 0;
const dotenv_1 = require("dotenv");
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Solo cargar el archivo .env si existe y no estamos en producción
if (process.env.NODE_ENV !== 'production' && fs_1.default.existsSync(path_1.default.resolve(__dirname, '../../.env'))) {
    (0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, '../../.env') });
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
exports.pool = new pg_1.Pool(dbConfig);
// Función para probar la conexión
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield exports.pool.connect();
        const result = yield client.query('SELECT version()');
        console.log('Conexión a CockroachDB establecida correctamente');
        console.log('Versión de CockroachDB:', result.rows[0].version);
        client.release();
        return true;
    }
    catch (error) {
        console.error('Error al conectar a CockroachDB:', error);
        return false;
    }
});
exports.testConnection = testConnection;
