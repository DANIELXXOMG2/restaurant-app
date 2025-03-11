// Service para manejar las operaciones relacionadas con pedidos

import axios from 'axios';

// URL de la API (se puede cambiar según el entorno)
const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000/api';

// Interfaces de datos
export interface DetallePedido {
  id?: number;
  pedido_id?: number;
  plato_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  nombre_plato?: string; // Campo adicional para mostrar en la UI
}

export interface Pedido {
  id?: number;
  usuario_id: number;
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
    const response = await axios.get(`${API_URL}/pedidos/usuario`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    return [];
  }
};

// Función para obtener un pedido específico
export const getPedido = async (id: number, token: string): Promise<Pedido | null> => {
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
export const actualizarPedido = async (id: number, datos: Partial<Pedido>, token: string): Promise<Pedido | null> => {
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
export const cambiarEstadoPedido = async (id: number, estado: Pedido['estado'], token: string): Promise<boolean> => {
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
export const cancelarPedido = async (id: number, token: string): Promise<boolean> => {
  return cambiarEstadoPedido(id, 'cancelado', token);
};

// Función para generar factura de un pedido
export const generarFactura = async (id: number, token: string): Promise<Blob | null> => {
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