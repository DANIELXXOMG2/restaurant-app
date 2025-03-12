import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from '../src/config/db';
import authRouter from '../src/routes/auth';
import productosRouter from '../src/routes/productos';

// Configurar variables de entorno
dotenv.config();

// Probar conexión a la base de datos
testConnection().catch(err => {
  console.error('Error de conexión a la base de datos:', err);
});

// Crear una instancia de Express para Vercel
const app = express();

// Configurar middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rutas
app.use('/api/auth', authRouter);
app.use('/api/productos', productosRouter);

// Ruta de prueba
app.get('/api', (_req, res) => {
  res.json({
    success: true,
    message: 'API de Restaurant App funcionando correctamente',
    version: '1.0.0'
  });
});

// Manejador de errores global
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Función handler para Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  // La URL de Vercel incluye la ruta completa, así que necesitamos mantener solo /api y lo que sigue
  const url = req.url || '';
  // Modificar la URL para que Express la procese correctamente
  req.url = url.replace(/^\/api\//, '/api/');
  
  // Manejar la solicitud con Express
  return app(req, res);
}; 