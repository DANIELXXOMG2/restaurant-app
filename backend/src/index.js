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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const path_1 = __importDefault(require("path"));
// Cargar variables de entorno (con ruta absoluta al archivo .env)
if (process.env.NODE_ENV !== 'production') {
    (0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, '../.env') });
}
// Verificar que la URL de conexión existe
if (!process.env.DATABASE_URL) {
    console.error('ERROR: No se encontró la variable DATABASE_URL en el archivo .env');
    process.exit(1);
}
// Mostrar la URL de conexión (ocultando la contraseña por seguridad)
const visibleUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':******@');
console.log('URL de conexión:', visibleUrl);
// Crear aplicación Express
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configuración de CORS
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como aplicaciones móviles, curl, etc.)
        if (!origin)
            return callback(null, true);
        // Lista de orígenes permitidos
        const allowedOrigins = [
            'http://localhost:5173', // Frontend local (Vite)
            'http://localhost:4173', // Frontend local (Vite preview)
            /^https:\/\/.*\.azurewebsites\.net$/ // Cualquier dominio de Azure App Service
        ];
        // Verificar si el origen está permitido
        const allowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return allowedOrigin === origin;
            }
            return allowedOrigin.test(origin);
        });
        if (allowed) {
            callback(null, true);
        }
        else {
            callback(new Error(`Origen no permitido: ${origin}`));
        }
    },
    credentials: true
}));
// Ruta de prueba
app.get('/', (_req, res) => {
    res.json({
        message: 'API de Restaurante funcionando correctamente',
        environment: process.env.NODE_ENV,
        database: 'CockroachDB (Cloud)',
        deployment: 'Azure App Service con Docker',
        version: '1.0.0'
    });
});
// Ruta para verificar la conexión a la base de datos
app.get('/api/check-db', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbConnected = yield (0, database_1.testConnection)();
        if (dbConnected) {
            res.json({ status: 'success', message: 'Conexión a CockroachDB establecida correctamente' });
        }
        else {
            res.status(500).json({ status: 'error', message: 'No se pudo conectar a la base de datos' });
        }
    }
    catch (error) {
        next(error);
    }
}));
// Middleware para manejar errores
app.use((err, _req, res, _next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor', message: err.message });
});
// Iniciar servidor
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Iniciando servidor...');
            console.log('Entorno:', process.env.NODE_ENV);
            // Probar la conexión a la base de datos
            console.log('Probando conexión a CockroachDB...');
            const dbConnected = yield (0, database_1.testConnection)();
            if (!dbConnected) {
                throw new Error('No se pudo conectar a la base de datos. Verifica la configuración.');
            }
            // Inicializar la base de datos (opcional, descomentar si se desea)
            // await initDatabase();
            // Iniciar el servidor
            app.listen(PORT, () => {
                console.log(`Servidor Express escuchando en el puerto ${PORT}`);
                console.log(`API disponible en http://localhost:${PORT}`);
                console.log('Aplicación desplegada en Azure App Service con Docker');
            });
        }
        catch (error) {
            console.error('Error al iniciar el servidor:', error);
            process.exit(1);
        }
    });
}
// Iniciar el servidor
startServer();
