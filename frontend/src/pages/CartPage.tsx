import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../components/ui/CartItem';
import { Button } from '../components/ui/Button';

// Este tipo representa un item en el carrito
interface CartProduct {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url: string;
}

// En una implementación real, estos datos vendrían de un estado global o context
const cartItemsInitial: CartProduct[] = [
  {
    id: 1,
    nombre: 'Hamburguesa Clásica',
    precio: 15000,
    cantidad: 2,
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/hamburguesa-clasica.jpg'
  },
  {
    id: 5,
    nombre: 'Coca-Cola',
    precio: 5000,
    cantidad: 2,
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/coca-cola.jpg'
  }
];

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartProduct[]>(cartItemsInitial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Función para formatear el precio en pesos colombianos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const iva = subtotal * 0.19; // IVA del 19%
  const total = subtotal + iva;

  // Función para actualizar la cantidad de un item
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  // Función para eliminar un item del carrito
  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Función para realizar el pedido
  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para enviar el pedido al backend
      // Por ejemplo:
      // const orderData = {
      //   items: cartItems.map(item => ({
      //     plato_id: item.id,
      //     cantidad: item.cantidad,
      //     precio_unitario: item.precio,
      //     subtotal: item.precio * item.cantidad
      //   })),
      //   subtotal,
      //   total
      // };
      // await pedidoService.crearPedido(orderData, token);
      
      // Simulamos una petición
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Vaciar el carrito
      setCartItems([]);
      
      // Navegar a una página de éxito
      navigate('/pedido-exitoso');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      // Aquí se manejaría el error, por ejemplo mostrando un toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tu Carrito</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">Agrega algunos productos para continuar con tu pedido.</p>
          <Link to="/menu">
            <Button>Ver Menú</Button>
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-sm rounded-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Detalle del Pedido</h2>
                <div className="divide-y divide-gray-200">
                  {cartItems.map(item => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      nombre={item.nombre}
                      precio={item.precio}
                      cantidad={item.cantidad}
                      imagen_url={item.imagen_url}
                      onRemove={handleRemoveItem}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/menu" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                ← Continuar comprando
              </Link>
            </div>
          </div>
          
          {/* Resumen del pedido */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white shadow-sm rounded-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen del Pedido</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (19%)</span>
                    <span className="text-gray-900 font-medium">{formatPrice(iva)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={handleCheckout} 
                    disabled={isSubmitting} 
                    className="w-full"
                  >
                    {isSubmitting ? 'Procesando...' : 'Finalizar Pedido'}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    ¡Gracias por tu pedido! Te enviaremos una confirmación cuando esté listo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 