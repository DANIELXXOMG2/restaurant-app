import { pool } from '../config/database';
import { QueryResult, QueryResultRow } from 'pg';

// Clase para gestionar las consultas a la base de datos
export class DbClient {
  // Método para ejecutar consultas SQL con parámetros
  public static async query<T extends QueryResultRow>(
    text: string, 
    params: any[] = []
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const result = await pool.query<T>(text, params);
      const duration = Date.now() - start;
      console.log(`Consulta ejecutada en ${duration}ms:`, { text, params });
      return result;
    } catch (error) {
      console.error('Error al ejecutar consulta:', error);
      throw error;
    }
  }

  // Método para transacciones
  public static async transaction<T>(
    callback: (client: any) => Promise<T>
  ): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en la transacción:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Método para insertar registros y devolver el ID
  public static async insert<T extends QueryResultRow>(
    table: string, 
    data: Record<string, any>, 
    returnColumn: string = 'id'
  ): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
    const columns = keys.join(',');
    
    const query = `
      INSERT INTO ${table} (${columns}) 
      VALUES (${placeholders}) 
      RETURNING ${returnColumn}
    `;
    
    const result = await this.query<T>(query, values);
    return result.rows[0];
  }
  
  // Método para actualizar registros
  public static async update<T extends QueryResultRow>(
    table: string, 
    id: number | string, 
    data: Record<string, any>, 
    idColumn: string = 'id'
  ): Promise<QueryResult<T>> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(',');
    
    const query = `
      UPDATE ${table} 
      SET ${setClause} 
      WHERE ${idColumn} = $${keys.length + 1} 
      RETURNING *
    `;
    
    return this.query<T>(query, [...values, id]);
  }
  
  // Método para eliminar registros
  public static async delete<T extends QueryResultRow>(
    table: string, 
    id: number | string, 
    idColumn: string = 'id'
  ): Promise<QueryResult<T>> {
    const query = `
      DELETE FROM ${table} 
      WHERE ${idColumn} = $1 
      RETURNING *
    `;
    
    return this.query<T>(query, [id]);
  }
} 