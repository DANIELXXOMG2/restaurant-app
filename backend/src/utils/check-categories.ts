import { pool } from '../config/database';

async function main() {
  try {
    console.log('Consultando categorías...');
    const categorias = await pool.query('SELECT * FROM categorias');
    console.log('Categorías:', categorias.rows);
    
    console.log('\nConsultando IDs de categorías...');
    const ids = await pool.query('SELECT id FROM categorias');
    console.log('IDs disponibles:', ids.rows.map(row => row.id));
    
    process.exit(0);
  } catch (error) {
    console.error('Error al consultar categorías:', error);
    process.exit(1);
  }
}

main(); 