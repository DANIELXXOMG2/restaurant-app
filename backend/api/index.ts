import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from '../src/config/db';
import authRoutes from '../src/routes/auth';
import productosRoutes from '../src/routes/productos';

// Configurar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);

// Probar conexión a la base de datos
testConnection().catch(err => {
  console.error('Error de conexión a la base de datos:', err);
});

// Punto de entrada para Vercel serverless
export default async (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
}; 