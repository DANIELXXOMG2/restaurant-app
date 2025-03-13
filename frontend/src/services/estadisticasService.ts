// Servicio para obtener estadísticas del sistema

import axios from 'axios';

// Configurar la URL base según la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Interfaz para las estadísticas
export interface Estadisticas {
  usuarios: number;
  pedidos: number;
  platos: number;
}

// Función para obtener estadísticas
export const getEstadisticas = async (): Promise<Estadisticas> => {
  try {
    const response = await axios.get<Estadisticas>(`${API_URL}/estadisticas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    // Si hay un error, devolvemos valores por defecto
    return {
      usuarios: 0,
      pedidos: 0,
      platos: 0
    };
  }
}; 