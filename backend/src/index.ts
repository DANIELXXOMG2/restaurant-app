import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { testConnection, pool } from './config/database';
import { initDatabase } from './db/init';
import { UsuarioModel } from './models/usuario';
import jwt from 'jsonwebtoken';
import path from 'path';
import ExcelJS from 'exceljs';

// Cargar variables de entorno (con ruta absoluta al archivo .env)
if (process.env.NODE_ENV !== 'production') {
  config({ path: path.resolve(__dirname, '../.env') });
}

// Verificar que la URL de conexión existe
if (!process.env.DATABASE_URL) {
  console.error('ERROR: No se encontró la variable DATABASE_URL en el archivo .env');
  process.exit(1);
}

// Mostrar la URL de conexión (ocultando la contraseña por seguridad)
const visibleUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':******@');
console.log('URL de conexión:', visibleUrl);

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
  origin: function(origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Si ALLOWED_ORIGINS es '*', permitir cualquier origen
    if (process.env.ALLOWED_ORIGINS === '*') {
      return callback(null, true);
    }
    
    // Lista de orígenes permitidos desde variables de entorno
    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
    
    // Lista de orígenes permitidos hardcodeados
    const allowedOriginsHardcoded = [
      'http://localhost:5173',  // Frontend local (Vite)
      'http://localhost:4173',  // Frontend local (Vite preview)
      'http://localhost',       // Frontend en Docker
      'http://localhost:80',    // Frontend en Docker
      'http://frontend',        // Nombre del servicio en Docker Compose
      'https://f7ea-179-63-189-229.ngrok-free.app', // URL específica de ngrok
      /^https:\/\/.*\.azurewebsites\.net$/,  // Cualquier dominio de Azure App Service
      /^https:\/\/.*\.ngrok-free\.app$/      // Cualquier dominio de ngrok
    ];
    
    // Combinar ambas listas
    const allowedOrigins = [...allowedOriginsEnv, ...allowedOriginsHardcoded];
    
    // Verificar si el origen está permitido
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      }
      return allowedOrigin.test && allowedOrigin.test(origin);
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origen no permitido: ${origin}`));
    }
  },
  credentials: true
}));

// Middleware para verificar el JWT
const verificarToken = (req: Request & { usuario?: any }, res: Response, next: NextFunction) => {
  // Obtener el token de los headers
  const authHeader = req.headers.authorization;
  console.log('Headers de autenticación:', req.headers.authorization);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token extraído:', token ? `${token.substring(0, 10)}...` : 'No token');

  if (!token) {
    return res.status(401).json({ 
      error: 'No autorizado', 
      message: 'Token no proporcionado' 
    });
  }

  try {
    // Verificar la clave secreta
    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    console.log('JWT Secret disponible:', !!jwtSecret);
    
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token decodificado:', decoded);
    
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(403).json({ 
      error: 'Prohibido', 
      message: 'Token inválido o expirado' 
    });
  }
};

// Ruta de prueba
app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: 'API de Restaurante funcionando correctamente',
    environment: process.env.NODE_ENV,
    database: 'CockroachDB (Cloud)',
    deployment: 'Azure App Service con Docker',
    version: '1.0.0'
  });
});

// Endpoint para registrar un nuevo usuario
app.post('/api/auth/register', (req: Request, res: Response, next: NextFunction) => {
  const { nombre, email, password, rol, imagen_url } = req.body;

  // Validar datos requeridos
  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ 
      error: 'Datos incompletos', 
      message: 'Se requieren nombre, email, password y rol' 
    });
  }

  // Implementación asíncrona
  (async () => {
    try {
      // Verificar si el usuario ya existe
      const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ 
          error: 'Email ya registrado', 
          message: 'Ya existe un usuario con ese email' 
        });
      }

      // Crear el nuevo usuario
      const nuevoUsuario = await UsuarioModel.crear({
        nombre,
        email,
        password,
        rol: rol as 'admin' | 'cliente',
        imagen_url: imagen_url || null
      });

      // Generar token JWT
      const token = jwt.sign(
        { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
        process.env.JWT_SECRET || 'default_secret'
      );

      // Responder con éxito
      res.status(201).json({
        message: 'Usuario registrado correctamente',
        token,
        user: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol,
          imagen_url: nuevoUsuario.imagen_url
        }
      });
    } catch (error) {
      console.error('Error en el registro:', error);
      next(error);
    }
  })();
});

// Endpoint para iniciar sesión
app.post('/api/auth/login', (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  console.log('Intento de login:', { email, passwordLength: password?.length });

  // Validar datos requeridos
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Datos incompletos', 
      message: 'Se requieren email y password' 
    });
  }

  // Implementación asíncrona
  (async () => {
    try {
      console.log('Validando credenciales para login...');
      
      // Validar credenciales
      const usuario = await UsuarioModel.validarCredenciales(email, password);
      console.log('Resultado de validación de credenciales:', { 
        autenticado: !!usuario,
        usuario: usuario ? { id: usuario.id, email: usuario.email } : null
      });
      
      if (!usuario) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas', 
          message: 'Email o contraseña incorrectos' 
        });
      }

      console.log('Generando token JWT para usuario autenticado...');
      
      // Generar token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET || 'default_secret'
      );

      console.log('Login exitoso, enviando respuesta...');
      
      // Responder con éxito
      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          imagen_url: usuario.imagen_url
        }
      });
    } catch (error) {
      console.error('Error en el login:', error);
      next(error);
    }
  })();
});

// Endpoint para crear un nuevo pedido
app.post('/api/pedidos', verificarToken, async (req: Request & { usuario?: any }, res: Response, next: NextFunction) => {
  try {
    const { usuario_id, estado, subtotal, total, detalles } = req.body;
    
    // Validar datos requeridos
    if (!usuario_id || !estado || !detalles || detalles.length === 0) {
      return res.status(400).json({ 
        error: 'Datos incompletos', 
        message: 'Se requieren usuario_id, estado, y detalles del pedido' 
      });
    }
    
    // Verificar que el usuario autenticado solo puede crear pedidos para sí mismo
    if (req.usuario.id !== usuario_id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'Prohibido', 
        message: 'No puedes crear pedidos para otros usuarios' 
      });
    }
    
    // Iniciar transacción
    const client = await pool.connect();
    let nuevoPedidoId;
    
    try {
      await client.query('BEGIN');
      
      // Insertar el pedido
      const pedidoQuery = `
        INSERT INTO pedidos (usuario_id, estado, total, metodo_pago) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id
      `;
      const metodo_pago = 'tarjeta'; // Valor por defecto o por determinar
      const pedidoValues = [usuario_id, estado, total, metodo_pago];
      const pedidoResult = await client.query(pedidoQuery, pedidoValues);
      nuevoPedidoId = pedidoResult.rows[0].id;
      
      // Verificar que los platos existan antes de crear los detalles
      for (const detalle of detalles) {
        // Verificar si el plato existe
        const platoExisteQuery = `SELECT id FROM platos WHERE id = $1`;
        const platoExisteResult = await client.query(platoExisteQuery, [detalle.plato_id]);
        
        if (platoExisteResult.rows.length === 0) {
          throw new Error(`El plato con ID ${detalle.plato_id} no existe en la base de datos`);
        }
        
        // Insertar el detalle del pedido
        const detalleQuery = `
          INSERT INTO detalles_pedido (pedido_id, plato_id, cantidad, precio_unitario, subtotal) 
          VALUES ($1, $2, $3, $4, $5)
        `;
        const detalleValues = [
          nuevoPedidoId, 
          detalle.plato_id, 
          detalle.cantidad, 
          detalle.precio_unitario, 
          detalle.subtotal
        ];
        await client.query(detalleQuery, detalleValues);
      }
      
      await client.query('COMMIT');
      
      res.status(201).json({
        message: 'Pedido creado correctamente',
        id: nuevoPedidoId
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al crear pedido:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error en la creación de pedido:', error);
    next(error);
  }
});

// Endpoint para obtener los pedidos del usuario actual
app.get('/api/pedidos/usuario', verificarToken, async (req: Request & { usuario?: any }, res: Response, next: NextFunction) => {
  try {
    const usuarioId = req.usuario.id;
    
    // Obtener los pedidos del usuario
    const pedidosQuery = `
      SELECT p.id, p.usuario_id, p.fecha, p.estado, p.total, p.metodo_pago, p.direccion_entrega
      FROM pedidos p
      WHERE p.usuario_id = $1
      ORDER BY p.fecha DESC
    `;
    const pedidosResult = await pool.query(pedidosQuery, [usuarioId]);
    const pedidos = pedidosResult.rows;
    
    // Para cada pedido, obtener sus detalles
    for (const pedido of pedidos) {
      const detallesQuery = `
        SELECT dp.id, dp.pedido_id, dp.plato_id, dp.cantidad, dp.precio_unitario, dp.subtotal,
               pl.nombre as nombre_plato, pl.imagen_url
        FROM detalles_pedido dp
        LEFT JOIN platos pl ON dp.plato_id = pl.id
        WHERE dp.pedido_id = $1
      `;
      const detallesResult = await pool.query(detallesQuery, [pedido.id]);
      pedido.detalles = detallesResult.rows;
      
      // Formatear la fecha para que sea un string ISO
      if (pedido.fecha) {
        pedido.fecha_pedido = pedido.fecha.toISOString();
      }
    }
    
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    next(error);
  }
});

// Ruta para verificar la conexión a la base de datos
app.get('/api/check-db', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const dbConnected = await testConnection();
    if (dbConnected) {
      res.json({ status: 'success', message: 'Conexión a CockroachDB establecida correctamente' });
    } else {
      res.status(500).json({ status: 'error', message: 'No se pudo conectar a la base de datos' });
    }
  } catch (error: any) {
    next(error);
  }
});

// Endpoint para obtener todos los platos
app.get('/api/platos', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const query = `
      SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria_id, p.imagen_url, p.disponible, 
             c.nombre as categoria_nombre
      FROM platos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.disponible = true
      ORDER BY p.categoria_id, p.nombre
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener platos:', error);
    next(error);
  }
});

// Endpoint para obtener estadísticas básicas (cantidad de usuarios y pedidos)
app.get('/api/estadisticas', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener cantidad de usuarios
    const usuariosQuery = 'SELECT COUNT(*) as total_usuarios FROM usuarios';
    const usuariosResult = await pool.query(usuariosQuery);
    const totalUsuarios = parseInt(usuariosResult.rows[0].total_usuarios);
    
    // Obtener cantidad de pedidos
    const pedidosQuery = 'SELECT COUNT(*) as total_pedidos FROM pedidos';
    const pedidosResult = await pool.query(pedidosQuery);
    const totalPedidos = parseInt(pedidosResult.rows[0].total_pedidos);
    
    // Obtener cantidad de platos
    const platosQuery = 'SELECT COUNT(*) as total_platos FROM platos WHERE disponible = true';
    const platosResult = await pool.query(platosQuery);
    const totalPlatos = parseInt(platosResult.rows[0].total_platos);
    
    // Devolver las estadísticas
    res.json({
      usuarios: totalUsuarios,
      pedidos: totalPedidos,
      platos: totalPlatos
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    next(error);
  }
});

// Endpoint para generar Excel con los detalles del pedido
app.get('/api/pedidos/:id/excel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pedidoId = req.params.id;
    
    // Obtener información del pedido
    const pedidoQuery = `
      SELECT p.id, p.fecha, p.estado, p.total, p.metodo_pago,
             u.nombre as cliente, u.email as email_cliente
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = $1
    `;
    const pedidoResult = await pool.query(pedidoQuery, [pedidoId]);
    
    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Pedido no encontrado', 
        message: 'No se encontró el pedido especificado' 
      });
    }
    
    const pedido = pedidoResult.rows[0];
    
    // Obtener detalles del pedido
    const detallesQuery = `
      SELECT dp.cantidad, dp.precio_unitario, dp.subtotal,
             pl.nombre as nombre_plato, pl.descripcion as descripcion_plato
      FROM detalles_pedido dp
      JOIN platos pl ON dp.plato_id = pl.id
      WHERE dp.pedido_id = $1
    `;
    const detallesResult = await pool.query(detallesQuery, [pedidoId]);
    const detalles = detallesResult.rows;
    
    // Crear workbook de Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Pizza Daniel\'s';
    workbook.lastModifiedBy = 'Sistema de Restaurante';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Crear hoja de detalle de pedido
    const worksheet = workbook.addWorksheet('Detalle de Pedido');
    
    // Estilo para títulos
    const titleStyle = {
      font: { bold: true, size: 14, color: { argb: '2B5EB0' } },
      fill: { 
        type: 'pattern' as const, 
        pattern: 'solid' as 'solid',
        fgColor: { argb: 'EDF2F7' } 
      },
      alignment: { horizontal: 'center' as const }
    };
    
    // Información del pedido
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'PIZZA DANIEL\'S - DETALLE DE PEDIDO';
    worksheet.getCell('A1').font = { bold: true, size: 16, color: { argb: '2B5EB0' } };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
    worksheet.mergeCells('A3:B3');
    worksheet.getCell('A3').value = 'Número de Pedido:';
    worksheet.getCell('A3').font = { bold: true };
    worksheet.mergeCells('C3:E3');
    worksheet.getCell('C3').value = pedido.id;
    
    worksheet.mergeCells('A4:B4');
    worksheet.getCell('A4').value = 'Cliente:';
    worksheet.getCell('A4').font = { bold: true };
    worksheet.mergeCells('C4:E4');
    worksheet.getCell('C4').value = pedido.cliente;
    
    // Ajustar fecha a zona horaria colombiana y formato local
    const fechaPedido = new Date(pedido.fecha);
    // Convertir a hora colombiana (UTC-5)
    const fechaColombia = new Date(fechaPedido.getTime() - (5 * 60 * 60 * 1000));
    // Formato colombiano: día/mes/año hora:minutos (24h)
    const fechaFormateada = fechaColombia.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    worksheet.mergeCells('A5:B5');
    worksheet.getCell('A5').value = 'Fecha:';
    worksheet.getCell('A5').font = { bold: true };
    worksheet.mergeCells('C5:E5');
    worksheet.getCell('C5').value = fechaFormateada;
    
    worksheet.mergeCells('A6:B6');
    worksheet.getCell('A6').value = 'Estado:';
    worksheet.getCell('A6').font = { bold: true };
    worksheet.mergeCells('C6:E6');
    worksheet.getCell('C6').value = pedido.estado;
    
    // Añadir email del cliente
    worksheet.mergeCells('A7:B7');
    worksheet.getCell('A7').value = 'Email:';
    worksheet.getCell('A7').font = { bold: true };
    worksheet.mergeCells('C7:E7');
    worksheet.getCell('C7').value = pedido.email_cliente;
    
    // Encabezados de la tabla
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(['Producto', 'Descripción', 'Cantidad', 'Precio Unitario', 'Subtotal']);
    headerRow.eachCell((cell) => {
      cell.font = titleStyle.font;
      cell.fill = titleStyle.fill;
      cell.alignment = titleStyle.alignment;
    });
    
    // Agregar datos de productos
    detalles.forEach(detalle => {
      worksheet.addRow([
        detalle.nombre_plato,
        detalle.descripcion_plato,
        detalle.cantidad,
        `$${detalle.precio_unitario}`,
        `$${detalle.subtotal}`
      ]);
    });
    
    // Agregar total
    worksheet.addRow([]);
    const totalRow = worksheet.addRow(['', '', '', 'TOTAL:', `$${pedido.total}`]);
    totalRow.getCell(5).font = { bold: true };
    totalRow.getCell(4).font = { bold: true };
    
    // Ajustar anchos de columna
    worksheet.getColumn(1).width = 25;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    
    // Crear respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=pedido_${pedidoId}.xlsx`);
    
    // Escribir archivo directamente a la respuesta
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al generar Excel del pedido:', error);
    next(error);
  }
});

// Endpoint para obtener detalles del carrito actual (sin guardar)
app.post('/api/carrito/excel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, subtotal, iva, total, usuario } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'Datos incompletos', 
        message: 'Se requieren items del carrito' 
      });
    }
    
    // Crear workbook de Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Pizza Daniel\'s';
    workbook.lastModifiedBy = 'Sistema de Restaurante';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Crear hoja de carrito
    const worksheet = workbook.addWorksheet('Carrito de Compras');
    
    // Estilo para títulos
    const titleStyle = {
      font: { bold: true, size: 14, color: { argb: '2B5EB0' } },
      fill: { 
        type: 'pattern' as const, 
        pattern: 'solid' as 'solid',
        fgColor: { argb: 'EDF2F7' } 
      },
      alignment: { horizontal: 'center' as const }
    };
    
    // Título
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'PIZZA DANIEL\'S - DETALLE DEL CARRITO';
    worksheet.getCell('A1').font = { bold: true, size: 16, color: { argb: '2B5EB0' } };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Usuario (si está disponible)
    if (usuario && usuario.nombre) {
      worksheet.mergeCells('A3:B3');
      worksheet.getCell('A3').value = 'Cliente:';
      worksheet.getCell('A3').font = { bold: true };
      worksheet.mergeCells('C3:E3');
      worksheet.getCell('C3').value = usuario.nombre;
      
      // Añadir email del usuario si está disponible
      if (usuario.email) {
        worksheet.mergeCells('A4:B4');
        worksheet.getCell('A4').value = 'Email:';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.mergeCells('C4:E4');
        worksheet.getCell('C4').value = usuario.email;
      }
    }
    
    // Fecha actual ajustada a zona horaria colombiana
    const fechaActual = new Date();
    // Convertir a hora colombiana (UTC-5)
    const fechaColombia = new Date(fechaActual.getTime() - (5 * 60 * 60 * 1000));
    // Formato colombiano: día/mes/año hora:minutos (24h)
    const fechaFormateada = fechaColombia.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    worksheet.mergeCells('A5:B5');
    worksheet.getCell('A5').value = 'Fecha:';
    worksheet.getCell('A5').font = { bold: true };
    worksheet.mergeCells('C5:E5');
    worksheet.getCell('C5').value = fechaFormateada;
    
    // Encabezados de la tabla
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(['Producto', 'Descripción', 'Cantidad', 'Precio Unitario', 'Subtotal']);
    headerRow.eachCell((cell) => {
      cell.font = titleStyle.font;
      cell.fill = titleStyle.fill;
      cell.alignment = titleStyle.alignment;
    });
    
    // Agregar datos de productos
    items.forEach((item: any) => {
      worksheet.addRow([
        item.nombre,
        item.descripcion || '',
        item.cantidad,
        `$${item.precio}`,
        `$${(item.precio * item.cantidad).toFixed(2)}`
      ]);
    });
    
    // Agregar subtotal, IVA y total
    worksheet.addRow([]);
    worksheet.addRow(['', '', '', 'Subtotal:', `$${subtotal}`]);
    worksheet.addRow(['', '', '', 'IVA (19%):', `$${iva}`]);
    const totalRow = worksheet.addRow(['', '', '', 'TOTAL:', `$${total}`]);
    totalRow.getCell(5).font = { bold: true };
    totalRow.getCell(4).font = { bold: true };
    
    // Ajustar anchos de columna
    worksheet.getColumn(1).width = 25;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    
    // Crear respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=carrito_${Date.now()}.xlsx`);
    
    // Escribir archivo directamente a la respuesta
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al generar Excel del carrito:', error);
    next(error);
  }
});

// Endpoint para actualizar la foto de perfil de un usuario
app.put('/api/usuarios/:id/foto', verificarToken, async (req: Request & { usuario?: any }, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { imagen_url } = req.body;
    
    // Verificar que el usuario autenticado solo puede actualizar su propio perfil
    if (req.usuario.id != userId && req.usuario.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'Prohibido', 
        message: 'No puedes actualizar el perfil de otro usuario' 
      });
    }
    
    // Verificar que la URL de imagen es válida
    if (!imagen_url) {
      return res.status(400).json({ 
        error: 'Datos incompletos', 
        message: 'Se requiere una URL de imagen' 
      });
    }
    
    // Actualizar la URL de la imagen del usuario
    const updateQuery = `
      UPDATE usuarios
      SET imagen_url = $1
      WHERE id = $2
      RETURNING id, nombre, email, rol, imagen_url
    `;
    const updateResult = await pool.query(updateQuery, [imagen_url, userId]);
    
    if (updateResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado', 
        message: 'No se encontró el usuario especificado' 
      });
    }
    
    // Obtener el usuario actualizado
    const usuarioActualizado = updateResult.rows[0];
    
    // Responder con éxito
    res.json({
      message: 'Foto de perfil actualizada correctamente',
      user: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar foto de perfil:', error);
    next(error);
  }
});

// Middleware para manejar errores
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor', message: err.message });
});

// Iniciar servidor
async function startServer() {
  try {
    console.log('Iniciando servidor...');
    console.log('Entorno:', process.env.NODE_ENV);
    
    // Probar la conexión a la base de datos
    console.log('Probando conexión a CockroachDB...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('No se pudo conectar a la base de datos. Verifica la configuración.');
    }
    
    // Inicializar la base de datos
    console.log('Inicializando esquema de la base de datos...');
    await initDatabase();
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor Express escuchando en el puerto ${PORT}`);
      console.log(`API disponible en http://localhost:${PORT}`);
      console.log('Aplicación desplegada en Azure App Service con Docker');
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer(); 