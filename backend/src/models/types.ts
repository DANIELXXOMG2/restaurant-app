// Interfaz para usuarios
export interface Usuario {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  rol: 'admin' | 'cliente';
  imagen_url?: string;
  fecha_registro: Date;
}

// Interfaz para categorías
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

// Interfaz para productos
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: number;
  imagen_url?: string;
  disponible: boolean;
}

// Interfaz para pedidos
export interface Pedido {
  id: number;
  usuario_id: number;
  fecha: Date;
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
  total: number;
  metodo_pago: string;
  direccion_entrega?: string;
}

// Interfaz para detalles de pedido
export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// Interfaz para facturas
export interface Factura {
  id: number;
  pedido_id: number;
  fecha_emision: Date;
  numero_factura: string;
  subtotal: number;
  impuestos: number;
  total: number;
} 