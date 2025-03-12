import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem as CartItemComponent } from '../components/ui/CartItem';
import { Button } from '../components/ui/Button';
import { PageTitle } from '../components/ui/PageTitle';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

export function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, getIVA, clearCart } = useCart();
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

  // Función para realizar el pedido
  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para enviar el pedido al backend
      // Por ejemplo:
      // const orderData = {
      //   items: items.map(item => ({
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
      
      // Mostrar mensaje de éxito
      toast.success('¡Pedido realizado con éxito!');
      
      // Guardar estado de pedido completado para la página de éxito
      sessionStorage.setItem('order_completed', 'true');
      
      // Vaciar el carrito
      clearCart();
      
      // Navegar a una página de éxito
      navigate('/pedido-exitoso');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      toast.error('Error al procesar tu pedido. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Carrito de Compras" />
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Tu Carrito</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Agrega algunos productos para continuar con tu pedido.</p>
          <Link to="/menu">
            <Button>Ver Menú</Button>
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Detalle del Pedido</h2>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map(item => (
                    <CartItemComponent
                      key={item.id}
                      id={item.id}
                      nombre={item.nombre}
                      precio={item.precio}
                      cantidad={item.cantidad}
                      imagen_url={item.imagen_url}
                      onRemove={removeItem}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/menu" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center">
                ← Continuar comprando
              </Link>
            </div>
          </div>
          
          {/* Resumen del pedido */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Resumen del Pedido</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">IVA (19%)</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{formatPrice(getIVA())}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatPrice(getTotal())}</span>
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
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