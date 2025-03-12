const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  // Obtener el token del header de autorización
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }
  
  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_temp_key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

// Middleware para verificar roles específicos
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acceso denegado. No tienes permisos suficientes para esta acción.' 
      });
    }
    
    next();
  };
};

// Middleware para verificar si un usuario es el propietario de un recurso o tiene rol admin
const authorizeOwnerOrAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }
  
  // Si es admin, permitir acceso
  if (req.user.role === 'admin') {
    return next();
  }
  
  // Obtener el ID del recurso a verificar
  const resourceId = req.params.id;
  const resourceType = req.baseUrl.split('/').pop(); // Obtener tipo de recurso de la URL
  
  try {
    let query;
    
    switch (resourceType) {
      case 'orders':
        // Verificar si el usuario es propietario del pedido
        query = 'SELECT * FROM orders WHERE id = $1';
        break;
      
      case 'items':
        // Verificar si el usuario es propietario del item
        query = 'SELECT * FROM items WHERE id = $1';
        break;
      
      default:
        // Si no se puede determinar el tipo de recurso, denegar acceso
        return res.status(403).json({ error: 'Acceso denegado.' });
    }
    
    const result = await pool.query(query, [resourceId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recurso no encontrado.' });
    }
    
    // Aquí deberías verificar si el usuario es propietario según tu lógica de negocio
    // Por ejemplo, si hay un campo user_id en el recurso
    
    next();
  } catch (error) {
    console.error('Error al verificar propiedad de recurso:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeOwnerOrAdmin
}; 