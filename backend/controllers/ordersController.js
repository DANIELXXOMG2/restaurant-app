const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, 
             COALESCE(json_agg(json_build_object(
               'id', oi.id,
               'item_id', oi.item_id,
               'quantity', oi.quantity,
               'unit_price', oi.unit_price,
               'notes', oi.notes
             )) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener un pedido por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    const itemsResult = await pool.query(`
      SELECT oi.*, i.name as item_name, i.description as item_description
      FROM order_items oi
      JOIN items i ON oi.item_id = i.id
      WHERE oi.order_id = $1
    `, [id]);
    
    const order = {
      ...orderResult.rows[0],
      items: itemsResult.rows
    };
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear un nuevo pedido
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      table_number,
      notes,
      items  // Array de productos: [{item_id, quantity, unit_price, notes}]
    } = req.body;
    
    // Validación
    if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos para crear el pedido' });
    }
    
    // Iniciar transacción
    await client.query('BEGIN');
    
    // Calcular total
    let totalPrice = 0;
    for (const item of items) {
      totalPrice += parseFloat(item.unit_price) * parseInt(item.quantity);
    }
    
    // Crear pedido
    const orderId = uuidv4();
    await client.query(`
      INSERT INTO orders (
        id, customer_name, customer_email, customer_phone, 
        table_number, notes, total_price, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      orderId, 
      customer_name, 
      customer_email, 
      customer_phone,
      table_number, 
      notes, 
      totalPrice, 
      'pending'
    ]);
    
    // Crear items del pedido
    for (const item of items) {
      await client.query(`
        INSERT INTO order_items (
          order_id, item_id, quantity, unit_price, notes
        ) VALUES ($1, $2, $3, $4, $5)
      `, [
        orderId,
        item.item_id,
        item.quantity,
        item.unit_price,
        item.notes
      ]);
      
      // Actualizar stock
      await client.query(`
        UPDATE items
        SET stock = stock - $1
        WHERE id = $2
      `, [item.quantity, item.item_id]);
    }
    
    // Confirmar transacción
    await client.query('COMMIT');
    
    // Obtener el pedido completo
    const result = await client.query(`
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id,
               'item_id', oi.item_id,
               'quantity', oi.quantity,
               'unit_price', oi.unit_price,
               'notes', oi.notes
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id
    `, [orderId]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Revertir transacción en caso de error
    await client.query('ROLLBACK');
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// Actualizar estado de un pedido
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validación
    if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: 'Estado inválido. Debe ser: pending, processing, completed o cancelled' 
      });
    }
    
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Cancelar un pedido y devolver productos al inventario
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    // Iniciar transacción
    await client.query('BEGIN');
    
    // Verificar si el pedido existe
    const orderCheck = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    // Obtener items del pedido para devolver al inventario
    const orderItems = await client.query(
      'SELECT item_id, quantity FROM order_items WHERE order_id = $1',
      [id]
    );
    
    // Devolver productos al inventario
    for (const item of orderItems.rows) {
      await client.query(
        'UPDATE items SET stock = stock + $1 WHERE id = $2',
        [item.quantity, item.item_id]
      );
    }
    
    // Eliminar items del pedido
    await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);
    
    // Actualizar pedido a cancelado en lugar de eliminarlo
    await client.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
      ['cancelled', id]
    );
    
    // Confirmar transacción
    await client.query('COMMIT');
    
    res.status(200).json({ message: 'Pedido cancelado correctamente' });
  } catch (error) {
    // Revertir transacción en caso de error
    await client.query('ROLLBACK');
    console.error('Error al cancelar pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

module.exports = router; 