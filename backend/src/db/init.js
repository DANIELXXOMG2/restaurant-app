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
exports.initDatabase = initDatabase;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../config/database");
// Función para inicializar la base de datos
function initDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Probar la conexión
            const connected = yield (0, database_1.testConnection)();
            if (!connected) {
                throw new Error('No se pudo establecer conexión con la base de datos.');
            }
            console.log('Inicializando base de datos...');
            // Leer el archivo schema.sql
            const schemaPath = path_1.default.join(__dirname, 'schema.sql');
            const schemaSql = fs_1.default.readFileSync(schemaPath, 'utf-8');
            // Dividir las consultas usando ';' como separador
            const queries = schemaSql
                .split(';')
                .filter(query => query.trim() !== '')
                .map(query => query.trim() + ';');
            // Ejecutar cada consulta
            for (const query of queries) {
                try {
                    yield database_1.pool.query(query);
                    console.log('Consulta ejecutada exitosamente');
                }
                catch (error) {
                    console.error('Error al ejecutar consulta:', error);
                    console.error('Consulta fallida:', query);
                }
            }
            console.log('Base de datos inicializada correctamente.');
        }
        catch (error) {
            console.error('Error al inicializar la base de datos:', error);
            throw error;
        }
    });
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
