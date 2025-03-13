import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPedidosUsuario, Pedido as PedidoInterface } from '../services/pedidoService';
import { useAuth } from '../contexts/AuthContext';
import { PageTitle } from '../components/ui/PageTitle';
import toast from 'react-hot-toast';

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const cargarPedidos = async () => {
      if (!user || !token) {
        console.log('No hay usuario o token disponible:', { user, tokenExists: !!token });
        toast.error('Debes iniciar sesión para ver tus pedidos');
        setIsLoading(false);
        return;
      }

      console.log('Cargando pedidos con token:', token.substring(0, 10) + '...');
      console.log('Usuario actual:', user);

      try {
        setIsLoading(true);
        const data = await getPedidosUsuario(token);
        console.log('Pedidos recibidos:', data);
        setPedidos(data);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        toast.error('No se pudieron cargar tus pedidos. Inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    cargarPedidos();
  }, [user, token]);

  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageTitle title="Mis Pedidos" />
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-6">
          Mis Pedidos
        </h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Mis Pedidos" />
      <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-6">
        Mis Pedidos
      </h1>
      
      {pedidos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No tienes pedidos aún.</p>
          <Link 
            to="/menu" 
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
          >
            Ver menú
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pedidos.map(pedido => (
            <div 
              key={pedido.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    Pedido #{pedido.id}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Fecha: {pedido.fecha_pedido ? formatDate(pedido.fecha_pedido) : 'Fecha no disponible'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  pedido.estado === 'entregado' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : pedido.estado === 'cancelado'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                </span>
              </div>
              
              {pedido.detalles && pedido.detalles.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Productos:
                  </h3>
                  <ul className="space-y-2">
                    {pedido.detalles.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.cantidad}x {item.nombre_plato || `Producto #${item.plato_id}`}
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {formatPrice(item.subtotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <span className="font-bold text-gray-800 dark:text-white">Total:</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(pedido.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosPage;