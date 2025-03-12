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

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Resto de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rutas - Eliminar el prefijo /api para que funcione correctamente en Vercel
app.use('/auth', authRouter);
app.use('/productos', productosRouter);

// Ruta de prueba
app.get('/', (_req, res) => {
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
  // Eliminar el prefijo /api de la URL para que Express pueda manejarla correctamente
  const url = req.url || '';
  req.url = url.replace(/^\/api/, '');
  
  // Registrar la solicitud para depuración
  console.log(`Recibida solicitud: ${req.method} ${req.url}`);
  
  // Manejar la solicitud con Express
  return app(req, res);
}; 