import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db';

// Importar rutas
import authRoutes from './routes/auth';
import productosRoutes from './routes/productos';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Probar conexión a la base de datos
testConnection().then(isConnected => {
  if (!isConnected) {
    console.error('Error de conexión a la base de datos. Verifique la configuración.');
    process.exit(1);
  }
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);

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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});

export default app; 