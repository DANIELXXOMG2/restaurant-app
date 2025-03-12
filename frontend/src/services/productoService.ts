// Service para manejar las operaciones relacionadas con productos y categorías

import axios from 'axios';

// URL de la API (se utiliza el proxy configurado en vite.config.ts)
const API_URL = '/api';

// Interfaces de datos
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  imagen_url: string;
  disponible: boolean;
}

// Función para obtener todas las categorías
export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await axios.get(`${API_URL}/categorias`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    // Por ahora, si hay un error devolvemos un array vacío
    // En el futuro, podemos implementar un mejor manejo de errores
    return [];
  }
};

// Función para obtener todos los productos
export const getProductos = async (): Promise<Producto[]> => {
  try {
    const response = await axios.get(`${API_URL}/platos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

// Función para obtener productos por categoría
export const getProductosPorCategoria = async (categoriaId: number): Promise<Producto[]> => {
  try {
    const response = await axios.get(`${API_URL}/platos?categoria_id=${categoriaId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener productos de la categoría ${categoriaId}:`, error);
    return [];
  }
};

// Función para obtener un producto específico
export const getProducto = async (id: number): Promise<Producto | null> => {
  try {
    const response = await axios.get(`${API_URL}/platos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto ${id}:`, error);
    return null;
  }
};

// Función para crear un nuevo producto (requiere autenticación)
export const crearProducto = async (producto: Omit<Producto, 'id'>, token: string): Promise<Producto | null> => {
  try {
    const response = await axios.post(
      `${API_URL}/platos`, 
      producto, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    return null;
  }
};

// Función para actualizar un producto existente (requiere autenticación)
export const actualizarProducto = async (id: number, datos: Partial<Producto>, token: string): Promise<Producto | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/platos/${id}`, 
      datos, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el producto ${id}:`, error);
    return null;
  }
};

// Función para eliminar un producto (requiere autenticación)
export const eliminarProducto = async (id: number, token: string): Promise<boolean> => {
  try {
    await axios.delete(
      `${API_URL}/platos/${id}`, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return true;
  } catch (error) {
    console.error(`Error al eliminar el producto ${id}:`, error);
    return false;
  }
}; 