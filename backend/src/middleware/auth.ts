import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../models/tipos';

// Extendemos la interfaz Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload;
    }
  }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No se proporcionó token de autenticación' });
    }

    // El formato típico es "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Formato de token inválido' });
    }

    // Verificar el token
    const secretKey = process.env.JWT_SECRET || 'clave_secreta_temporal';
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    
    // Añadir la información del usuario al request para uso posterior
    req.usuario = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, error: 'Token inválido' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, error: 'Token expirado' });
    }
    return res.status(500).json({ success: false, error: 'Error de autenticación' });
  }
};

// Middleware para verificar rol de administrador
export const esAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.usuario) {
    return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
  }

  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ success: false, error: 'Acceso denegado. Se requiere rol de administrador' });
  }

  next();
}; 