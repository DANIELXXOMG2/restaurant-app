import { Router, Request, Response } from 'express';
import { z } from 'zod';
import pool from '../config/db';
import { verificarToken, esAdmin } from '../middleware/auth';
import { ProductoDTO } from '../models/tipos';

const router = Router();

// Esquema de validación para productos
const schemaProducto = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  precio: z.number().positive('El precio debe ser un valor positivo'),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  categoria_id: z.number().int().positive('La categoría es requerida'),
  imagen: z.string().optional()
});

// Obtener todos los productos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const productos = await pool.query(
      `SELECT p.*, c.nombre as categoria 
       FROM productos p 
       LEFT JOIN categorias c ON p.categoria_id = c.id 
       ORDER BY p.nombre`
    );
    
    res.json({
      success: true,
      data: productos.rows,
      message: 'Productos obtenidos correctamente'
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los productos'
    });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const producto = await pool.query(
      `SELECT p.*, c.nombre as categoria 
       FROM productos p 
       LEFT JOIN categorias c ON p.categoria_id = c.id 
       WHERE p.id = $1`,
      [id]
    );
    
    if (producto.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: producto.rows[0],
      message: 'Producto obtenido correctamente'
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el producto'
    });
  }
});

// Crear un nuevo producto (solo admin)
router.post('/', verificarToken, esAdmin, async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    const resultado = schemaProducto.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        detalles: resultado.error.errors
      });
    }
    
    const producto: ProductoDTO = resultado.data;
    
    // Verificar que la categoría existe
    const categoriaExiste = await pool.query(
      'SELECT id FROM categorias WHERE id = $1',
      [producto.categoria_id]
    );
    
    if (categoriaExiste.rowCount === 0) {
      return res.status(400).json({
        success: false,
        error: 'La categoría seleccionada no existe'
      });
    }
    
    // Insertar producto en la base de datos
    const nuevoProducto = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, nombre, descripcion, precio, stock, categoria_id, imagen`,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.categoria_id,
        producto.imagen || null
      ]
    );
    
    res.status(201).json({
      success: true,
      data: nuevoProducto.rows[0],
      message: 'Producto creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear el producto'
    });
  }
});

// Actualizar un producto (solo admin)
router.put('/:id', verificarToken, esAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validar datos de entrada
    const resultado = schemaProducto.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        detalles: resultado.error.errors
      });
    }
    
    const producto: ProductoDTO = resultado.data;
    
    // Verificar que el producto existe
    const productoExiste = await pool.query(
      'SELECT id FROM productos WHERE id = $1',
      [id]
    );
    
    if (productoExiste.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    // Verificar que la categoría existe
    const categoriaExiste = await pool.query(
      'SELECT id FROM categorias WHERE id = $1',
      [producto.categoria_id]
    );
    
    if (categoriaExiste.rowCount === 0) {
      return res.status(400).json({
        success: false,
        error: 'La categoría seleccionada no existe'
      });
    }
    
    // Actualizar producto en la base de datos
    const productoActualizado = await pool.query(
      `UPDATE productos 
       SET nombre = $1, descripcion = $2, precio = $3, stock = $4, categoria_id = $5, imagen = $6 
       WHERE id = $7 
       RETURNING id, nombre, descripcion, precio, stock, categoria_id, imagen`,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.categoria_id,
        producto.imagen || null,
        id
      ]
    );
    
    res.json({
      success: true,
      data: productoActualizado.rows[0],
      message: 'Producto actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el producto'
    });
  }
});

// Eliminar un producto (solo admin)
router.delete('/:id', verificarToken, esAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar que el producto existe
    const productoExiste = await pool.query(
      'SELECT id FROM productos WHERE id = $1',
      [id]
    );
    
    if (productoExiste.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    // Verificar si el producto está en algún pedido
    const enPedidos = await pool.query(
      'SELECT * FROM detalles_pedido WHERE producto_id = $1 LIMIT 1',
      [id]
    );
    
    if (enPedidos.rowCount && enPedidos.rowCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'No se puede eliminar el producto porque está asociado a pedidos'
      });
    }
    
    // Eliminar producto de la base de datos
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el producto'
    });
  }
});

export default router; 