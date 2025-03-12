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

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear una nueva categoría
router.post('/', async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    
    // Validación
    if (!name) {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }
    
    const result = await pool.query(
      'INSERT INTO categories (name, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, description, image_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar una categoría
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    
    // Validación
    if (!name) {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }
    
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2, image_url = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [name, description, image_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar una categoría
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existen productos con esta categoría
    const productsCheck = await pool.query('SELECT COUNT(*) FROM items WHERE category = $1', [id]);
    
    if (parseInt(productsCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar esta categoría porque tiene productos asociados',
        count: parseInt(productsCheck.rows[0].count)
      });
    }
    
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    res.status(200).json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 