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
exports.DbClient = void 0;
const database_1 = require("../config/database");
// Clase para gestionar las consultas a la base de datos
class DbClient {
    // Método para ejecutar consultas SQL con parámetros
    static query(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, params = []) {
            const start = Date.now();
            try {
                const result = yield database_1.pool.query(text, params);
                const duration = Date.now() - start;
                console.log(`Consulta ejecutada en ${duration}ms:`, { text, params });
                return result;
            }
            catch (error) {
                console.error('Error al ejecutar consulta:', error);
                throw error;
            }
        });
    }
    // Método para transacciones
    static transaction(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.pool.connect();
            try {
                yield client.query('BEGIN');
                const result = yield callback(client);
                yield client.query('COMMIT');
                return result;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Error en la transacción:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Método para insertar registros y devolver el ID
    static insert(table_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (table, data, returnColumn = 'id') {
            const keys = Object.keys(data);
            const values = Object.values(data);
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
            const columns = keys.join(',');
            const query = `
      INSERT INTO ${table} (${columns}) 
      VALUES (${placeholders}) 
      RETURNING ${returnColumn}
    `;
            const result = yield this.query(query, values);
            return result.rows[0];
        });
    }
    // Método para actualizar registros
    static update(table_1, id_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (table, id, data, idColumn = 'id') {
            const keys = Object.keys(data);
            const values = Object.values(data);
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(',');
            const query = `
      UPDATE ${table} 
      SET ${setClause} 
      WHERE ${idColumn} = $${keys.length + 1} 
      RETURNING *
    `;
            return this.query(query, [...values, id]);
        });
    }
    // Método para eliminar registros
    static delete(table_1, id_1) {
        return __awaiter(this, arguments, void 0, function* (table, id, idColumn = 'id') {
            const query = `
      DELETE FROM ${table} 
      WHERE ${idColumn} = $1 
      RETURNING *
    `;
            return this.query(query, [id]);
        });
    }
}
exports.DbClient = DbClient;
