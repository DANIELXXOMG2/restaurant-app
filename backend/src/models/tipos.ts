// Interfaces para los modelos de datos

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'cliente';
  creado_en: Date;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: number;
  imagen?: string;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  fecha: Date;
  estado: 'pendiente' | 'completado' | 'cancelado';
  total: number;
}

export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// DTOs (Data Transfer Objects) para recibir datos en los endpoints

export interface UsuarioDTO {
  nombre: string;
  email: string;
  password: string;
  rol?: 'admin' | 'cliente';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CategoriaDTO {
  nombre: string;
  descripcion?: string;
}

export interface ProductoDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: number;
  imagen?: string;
}

export interface PedidoDTO {
  usuario_id: number;
  items: {
    producto_id: number;
    cantidad: number;
  }[];
}

// Interfaces para respuestas

export interface JwtPayload {
  id: number;
  email: string;
  rol: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 