// Servicio para manejar las peticiones a la API

// Configurar la URL base según el entorno
const isProd = import.meta.env.PROD;
// En producción usar la URL absoluta, en desarrollo usar la URL relativa con proxy
const API_URL = isProd 
  ? 'https://restaurant-app-tau-ten.vercel.app/api' 
  : '/api';

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