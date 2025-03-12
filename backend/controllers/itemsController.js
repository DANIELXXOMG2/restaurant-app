const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Obtener todos los items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener items:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener un item por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear un nuevo item
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    
    // Validación básica
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Nombre, precio y categoría son obligatorios' });
    }
    
    const result = await pool.query(
      'INSERT INTO items (name, description, price, category, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, category, image_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar un item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;
    
    // Verificar si el item existe
    const checkResult = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, price = $3, category = $4, image_url = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [name, description, price, category, image_url, id]
    );
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar un item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el item existe
    const checkResult = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.status(200).json({ message: 'Item eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;