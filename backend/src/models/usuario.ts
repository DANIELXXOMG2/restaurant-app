import { DbClient } from '../db/dbClient';
import { Usuario } from './types';
import bcrypt from 'bcryptjs';

export class UsuarioModel {
  /**
   * Crea un nuevo usuario
   */
  static async crear(usuario: Omit<Usuario, 'id' | 'fecha_registro'>): Promise<Usuario> {
    try {
      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(usuario.password, salt);
      
      // Crear el usuario con la contraseña hasheada
      const nuevoUsuario = {
        ...usuario,
        password: hashedPassword,
      };
      
      // Insertar en la base de datos
      return await DbClient.insert<Usuario>('usuarios', nuevoUsuario);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }
  
  /**
   * Busca un usuario por su email
   */
  static async buscarPorEmail(email: string): Promise<Usuario | null> {
    try {
      console.log('Buscando usuario por email:', email);
      
      const result = await DbClient.query<Usuario>(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );
      
      console.log('Resultado de búsqueda de usuario:', {
        encontrado: result.rows.length > 0,
        filas: result.rowCount
      });
      
      if (result.rows.length > 0) {
        const usuario = result.rows[0];
        console.log('Usuario encontrado:', {
          id: usuario.id,
          email: usuario.email,
          tienePassword: !!usuario.password,
          longitudPassword: usuario.password?.length
        });
      }
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }
  
  /**
   * Actualiza un usuario existente
   */
  static async actualizar(id: number, datos: Partial<Omit<Usuario, 'id' | 'fecha_registro'>>): Promise<Usuario | null> {
    try {
      // Si hay contraseña, hashearla
      if (datos.password) {
        const salt = await bcrypt.genSalt(10);
        datos.password = await bcrypt.hash(datos.password, salt);
      }
      
      const result = await DbClient.update<Usuario>('usuarios', id, datos);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  
  /**
   * Elimina un usuario
   */
  static async eliminar(id: number): Promise<boolean> {
    try {
      const result = await DbClient.delete<Usuario>('usuarios', id);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene todos los usuarios
   */
  static async obtenerTodos(): Promise<Usuario[]> {
    try {
      const result = await DbClient.query<Usuario>(
        'SELECT id, nombre, apellido, email, rol, fecha_registro FROM usuarios'
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene un usuario por su ID
   */
  static async obtenerPorId(id: number): Promise<Usuario | null> {
    try {
      const result = await DbClient.query<Usuario>(
        'SELECT id, nombre, apellido, email, rol, fecha_registro FROM usuarios WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw error;
    }
  }
  
  /**
   * Valida las credenciales de un usuario
   */
  static async validarCredenciales(email: string, password: string): Promise<Usuario | null> {
    try {
      console.log('Intentando validar credenciales para:', email);
      
      // Buscar usuario por email
      const usuario = await this.buscarPorEmail(email);
      if (!usuario) {
        console.log('Usuario no encontrado con el email:', email);
        return null;
      }
      
      console.log('Usuario encontrado:', { id: usuario.id, email: usuario.email });
      
      // Verificar la contraseña
      console.log('Comparando contraseñas...');
      const passwordValida = await bcrypt.compare(password, usuario.password);
      console.log('Resultado de comparación de contraseñas:', passwordValida);
      
      if (!passwordValida) {
        console.log('Contraseña inválida para el usuario:', email);
        return null;
      }
      
      console.log('Credenciales válidas para el usuario:', email);
      return usuario;
    } catch (error) {
      console.error('Error al validar credenciales:', error);
      throw error;
    }
  }
} 