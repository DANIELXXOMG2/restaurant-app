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
exports.startNgrokTunnel = void 0;
const child_process_1 = require("child_process");
const dotenv_1 = require("dotenv");
// Cargar variables de entorno
(0, dotenv_1.config)();
const PORT = process.env.PORT || 3000;
/**
 * Inicia un túnel ngrok para exponer la aplicación local a Internet
 * Nota: Requiere tener ngrok instalado y configurado
 */
const startNgrokTunnel = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (process.env.NODE_ENV !== 'development') {
        console.log('Ngrok solo se inicia en entorno de desarrollo.');
        return;
    }
    try {
        // Comando para iniciar ngrok
        const command = `ngrok http ${PORT}`;
        console.log(`Iniciando túnel ngrok en el puerto ${PORT}...`);
        // Ejecutar el comando
        const ngrokProcess = (0, child_process_1.exec)(command);
        // Manejar la salida
        (_a = ngrokProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
            console.log(`ngrok: ${data}`);
        });
        // Manejar errores
        (_b = ngrokProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
            console.error(`Error de ngrok: ${data}`);
        });
        // Detectar si ngrok se cierra
        ngrokProcess.on('close', (code) => {
            if (code !== 0) {
                console.log(`ngrok se ha cerrado con código ${code}`);
            }
        });
        console.log('Túnel ngrok iniciado. Verifica la URL en la salida.');
        // Añadir gestión para cerrar ngrok al finalizar la aplicación
        process.on('SIGINT', () => {
            console.log('Cerrando túnel ngrok...');
            ngrokProcess.kill();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Error al iniciar ngrok:', error);
        console.log('Asegúrate de tener ngrok instalado y configurado correctamente.');
    }
});
exports.startNgrokTunnel = startNgrokTunnel;
