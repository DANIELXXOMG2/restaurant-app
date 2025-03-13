// Service para manejar las operaciones relacionadas con platos

import axios from 'axios';

// Configurar la URL base según la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Interfaces de datos
export interface Plato {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: string;
  imagen_url: string;
  disponible: boolean;
  categoria_nombre?: string;
}

// Interfaz para los datos crudos del plato desde la API
interface PlatoRaw {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria_id: string;
  imagen_url: string;
  disponible: boolean;
  categoria_nombre?: string;
}

// Función para obtener todos los platos
export const getPlatos = async (): Promise<Plato[]> => {
  try {
    const response = await axios.get<PlatoRaw[]>(`${API_URL}/platos`);
    
    // Convertir los precios a números
    const platos = response.data.map((plato: PlatoRaw) => ({
      ...plato,
      precio: parseFloat(plato.precio),
      stock: parseInt(plato.stock)
    }));
    
    return platos;
  } catch (error) {
    console.error('Error al obtener platos:', error);
    return [];
  }
};

// Función para obtener un plato específico
export const getPlato = async (id: string): Promise<Plato | null> => {
  try {
    const platos = await getPlatos();
    return platos.find(plato => plato.id === id) || null;
  } catch (error) {
    console.error(`Error al obtener el plato ${id}:`, error);
    return null;
  }
};

// Función para obtener platos por categoría
export const getPlatosPorCategoria = async (categoriaId: string): Promise<Plato[]> => {
  try {
    const platos = await getPlatos();
    return platos.filter(plato => plato.categoria_id === categoriaId);
  } catch (error) {
    console.error(`Error al obtener platos de la categoría ${categoriaId}:`, error);
    return [];
  }
}; 