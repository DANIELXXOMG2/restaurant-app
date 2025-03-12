import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { LoginDTO, UsuarioDTO } from '../models/tipos';
import { z } from 'zod';

const router = Router();

// Esquema de validación para registro
const schemaRegistro = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['admin', 'cliente']).optional().default('cliente')
});

// Esquema de validación para login
const schemaLogin = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

// Ruta para registrar un nuevo usuario
router.post('/registro', async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    const resultado = schemaRegistro.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({ 
        success: false, 
        error: 'Datos inválidos', 
        detalles: resultado.error.errors 
      });
    }

    const usuario: UsuarioDTO = resultado.data;

    // Verificar si el email ya existe
    const emailExistente = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [usuario.email]
    );

    if (emailExistente.rowCount && emailExistente.rowCount > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Este correo electrónico ya está registrado' 
      });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(usuario.password, salt);

    // Insertar usuario en la base de datos
    const nuevoUsuario = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [usuario.nombre, usuario.email, hashedPassword, usuario.rol]
    );

    // Generar JWT
    const payload = {
      id: nuevoUsuario.rows[0].id,
      email: nuevoUsuario.rows[0].email,
      rol: nuevoUsuario.rows[0].rol
    };

    const secretKey = process.env.JWT_SECRET || 'clave_secreta_temporal';
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      data: {
        usuario: {
          id: nuevoUsuario.rows[0].id,
          nombre: nuevoUsuario.rows[0].nombre,
          email: nuevoUsuario.rows[0].email,
          rol: nuevoUsuario.rows[0].rol
        },
        token
      },
      message: 'Usuario registrado correctamente'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al registrar usuario' 
    });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    const resultado = schemaLogin.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({ 
        success: false, 
        error: 'Datos inválidos', 
        detalles: resultado.error.errors 
      });
    }

    const { email, password }: LoginDTO = resultado.data;

    // Buscar usuario por email
    const busquedaUsuario = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (busquedaUsuario.rowCount === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Credenciales inválidas' 
      });
    }

    const usuario = busquedaUsuario.rows[0];

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ 
        success: false, 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar JWT
    const payload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    };

    const secretKey = process.env.JWT_SECRET || 'clave_secreta_temporal';
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

    res.json({
      success: true,
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        },
        token
      },
      message: 'Inicio de sesión exitoso'
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al iniciar sesión' 
    });
  }
});

export default router; 