// Servicio para manejar las peticiones a la API

// Configurar la URL base según la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || '/api';

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