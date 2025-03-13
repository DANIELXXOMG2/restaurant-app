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
exports.UsuarioModel = void 0;
const dbClient_1 = require("../db/dbClient");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UsuarioModel {
    /**
     * Crea un nuevo usuario
     */
    static crear(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Hashear la contraseña
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(usuario.password, salt);
                // Crear el usuario con la contraseña hasheada
                const nuevoUsuario = Object.assign(Object.assign({}, usuario), { password: hashedPassword });
                // Insertar en la base de datos
                return yield dbClient_1.DbClient.insert('usuarios', nuevoUsuario);
            }
            catch (error) {
                console.error('Error al crear usuario:', error);
                throw error;
            }
        });
    }
    /**
     * Busca un usuario por su email
     */
    static buscarPorEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dbClient_1.DbClient.query('SELECT * FROM usuarios WHERE email = $1', [email]);
                return result.rows.length > 0 ? result.rows[0] : null;
            }
            catch (error) {
                console.error('Error al buscar usuario por email:', error);
                throw error;
            }
        });
    }
    /**
     * Actualiza un usuario existente
     */
    static actualizar(id, datos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Si hay contraseña, hashearla
                if (datos.password) {
                    const salt = yield bcryptjs_1.default.genSalt(10);
                    datos.password = yield bcryptjs_1.default.hash(datos.password, salt);
                }
                const result = yield dbClient_1.DbClient.update('usuarios', id, datos);
                return result.rows.length > 0 ? result.rows[0] : null;
            }
            catch (error) {
                console.error('Error al actualizar usuario:', error);
                throw error;
            }
        });
    }
    /**
     * Elimina un usuario
     */
    static eliminar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dbClient_1.DbClient.delete('usuarios', id);
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('Error al eliminar usuario:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene todos los usuarios
     */
    static obtenerTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dbClient_1.DbClient.query('SELECT id, nombre, apellido, email, rol, fecha_registro FROM usuarios');
                return result.rows;
            }
            catch (error) {
                console.error('Error al obtener usuarios:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene un usuario por su ID
     */
    static obtenerPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dbClient_1.DbClient.query('SELECT id, nombre, apellido, email, rol, fecha_registro FROM usuarios WHERE id = $1', [id]);
                return result.rows.length > 0 ? result.rows[0] : null;
            }
            catch (error) {
                console.error('Error al obtener usuario por ID:', error);
                throw error;
            }
        });
    }
    /**
     * Valida las credenciales de un usuario
     */
    static validarCredenciales(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar usuario por email
                const usuario = yield this.buscarPorEmail(email);
                if (!usuario)
                    return null;
                // Verificar la contraseña
                const passwordValida = yield bcryptjs_1.default.compare(password, usuario.password);
                if (!passwordValida)
                    return null;
                return usuario;
            }
            catch (error) {
                console.error('Error al validar credenciales:', error);
                throw error;
            }
        });
    }
}
exports.UsuarioModel = UsuarioModel;
