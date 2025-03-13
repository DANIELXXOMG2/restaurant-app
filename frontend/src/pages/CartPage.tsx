import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem as CartItemComponent } from '../components/ui/CartItem';
import { Button } from '../components/ui/Button';
import { PageTitle } from '../components/ui/PageTitle';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { crearPedido } from '../services/pedidoService';
import toast from 'react-hot-toast';
import { Icons } from '../components/icons';
import axios from 'axios';

export function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, getIVA, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Función para formatear el precio en pesos colombianos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Función para finalizar la compra
  const handleCheckout = async () => {
    if (!user || !token) {
      toast.error('Debes iniciar sesión para realizar el pedido');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar los detalles del pedido
      const detalles = items.map(item => ({
        plato_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        subtotal: item.precio * item.cantidad
      }));

      // Crear el pedido
      const pedido = {
        usuario_id: user.id,
        estado: 'pendiente' as 'pendiente' | 'en preparación' | 'listo' | 'entregado' | 'cancelado',
        subtotal: getSubtotal(),
        total: getTotal(),
        detalles
      };

      // Enviar la solicitud a la API
      await crearPedido(pedido, token);

      // Mostrar notificación de éxito
      toast.success('Pedido realizado con éxito');
      
      // Limpiar el carrito
      clearCart();
      
      // Redirigir a la página de pedidos
      navigate('/pedidos');
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
      toast.error('Error al realizar el pedido. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para descargar Excel del carrito
  const handleDownloadExcel = async () => {
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setIsDownloading(true);

    try {
      // Preparar los datos del carrito
      const cartData = {
        items: items.map(item => ({
          ...item,
          descripcion: 'Producto de Pizza Daniel\'s'
        })),
        subtotal: getSubtotal(),
        iva: getIVA(),
        total: getTotal(),
        // Incluir datos del usuario si está autenticado
        usuario: user ? {
          id: user.id,
          nombre: user.nombre,
          email: user.email
        } : null
      };

      // Realizar la solicitud para generar el Excel
      const response = await axios.post(
        `${API_URL}/carrito/excel`, 
        cartData, 
        { 
          responseType: 'blob',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
      );

      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Crear un enlace temporal y hacer clic en él para descargar
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `carrito_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('Excel generado correctamente');
    } catch (error) {
      console.error('Error al generar Excel:', error);
      toast.error('Error al generar Excel. Inténtalo de nuevo.');
    } finally {
      setIsDownloading(false);
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
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md overflow-hidden sticky top-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Resumen del Pedido</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="text-gray-900 dark:text-gray-100">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">IVA (19%)</span>
                    <span className="text-gray-900 dark:text-gray-100">{formatPrice(getIVA())}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">Total</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(getTotal())}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isSubmitting || items.length === 0}
                  >
                    {isSubmitting ? 'Procesando...' : 'Finalizar Pedido'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    onClick={handleDownloadExcel}
                    disabled={isDownloading || items.length === 0}
                  >
                    {isDownloading ? (
                      <span>Generando...</span>
                    ) : (
                      <>
                        <Icons.excel className="h-4 w-4 mr-2" />
                        <span>Descargar Excel</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 