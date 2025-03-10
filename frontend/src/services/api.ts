// Servicio para manejar las peticiones a la API

const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000/api';

export const fetchHello = async () => {
  try {
    const response = await fetch(`${API_URL}/hello`);
    if (!response.ok) {
      throw new Error('Error en la petición');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  }
};

// Aquí puedes agregar más funciones para otras rutas de la API 