// Service para manejar las operaciones relacionadas con pedidos

import axios from 'axios';

// Configurar la URL base según la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Interfaces de datos
export interface DetallePedido {
  id?: string;
  pedido_id?: string;
  plato_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  nombre_plato?: string; // Campo adicional para mostrar en la UI
  imagen_url?: string;
}

export interface Pedido {
  id?: string;
  usuario_id: string;
  fecha_pedido?: string;
  estado: 'pendiente' | 'en preparación' | 'listo' | 'entregado' | 'cancelado';
  direccion_entrega?: string | null;
  subtotal: number;
  total: number;
  detalles?: DetallePedido[];
}

// Función para obtener todos los pedidos del usuario actual
export const getPedidosUsuario = async (token: string): Promise<Pedido[]> => {
  try {
    console.log('Solicitando pedidos del usuario con token:', token.substring(0, 10) + '...');
    console.log('URL de la API:', `${API_URL}/pedidos/usuario`);
    
    const response = await axios.get(`${API_URL}/pedidos/usuario`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Respuesta del servidor:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    throw error;
  }
};

// Función para obtener un pedido específico
export const getPedido = async (id: string, token: string): Promise<Pedido | null> => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el pedido ${id}:`, error);
    return null;
  }
};

// Función para crear un nuevo pedido
export const crearPedido = async (pedido: Omit<Pedido, 'id' | 'fecha_pedido'>, token: string): Promise<Pedido | null> => {
  try {
    const response = await axios.post(
      `${API_URL}/pedidos`, 
      pedido, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    return null;
  }
};

// Función para actualizar un pedido existente
export const actualizarPedido = async (id: string, datos: Partial<Pedido>, token: string): Promise<Pedido | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/pedidos/${id}`, 
      datos, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el pedido ${id}:`, error);
    return null;
  }
};

// Función para cambiar el estado de un pedido
export const cambiarEstadoPedido = async (id: string, estado: Pedido['estado'], token: string): Promise<boolean> => {
  try {
    await axios.patch(
      `${API_URL}/pedidos/${id}/estado`, 
      { estado }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return true;
  } catch (error) {
    console.error(`Error al cambiar el estado del pedido ${id}:`, error);
    return false;
  }
};

// Función para cancelar un pedido
export const cancelarPedido = async (id: string, token: string): Promise<boolean> => {
  return cambiarEstadoPedido(id, 'cancelado', token);
};

// Función para generar factura de un pedido
export const generarFactura = async (id: string, token: string): Promise<Blob | null> => {
  try {
    const response = await axios.get(
      `${API_URL}/pedidos/${id}/factura`, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      }
    );
    return new Blob([response.data], { type: 'application/pdf' });
  } catch (error) {
    console.error(`Error al generar factura para el pedido ${id}:`, error);
    return null;
  }
}; 