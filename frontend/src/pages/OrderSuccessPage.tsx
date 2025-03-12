import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageTitle } from '../components/ui/PageTitle';
import { Icons } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

export function OrderSuccessPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir al inicio si se accede directamente sin completar un pedido
  useEffect(() => {
    const hasOrderCompleted = sessionStorage.getItem('order_completed');
    if (!hasOrderCompleted) {
      navigate('/');
    } else {
      // Limpiar la marca de pedido completado después de mostrar esta página
      return () => {
        sessionStorage.removeItem('order_completed');
      };
    }
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <PageTitle title="Pedido Exitoso" />
      
      <div className="max-w-xl mx-auto text-center bg-white dark:bg-gray-800 shadow-sm rounded-xl p-8 border border-primary-100 dark:border-primary-800">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-6">
          <Icons.restaurant className="h-10 w-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">¡Pedido Realizado con Éxito!</h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Gracias por tu pedido. Hemos recibido tu solicitud y estamos procesándola.
          {isAuthenticated ? (
            ' Puedes seguir el estado de tu pedido en la sección "Mis Pedidos".'
          ) : (
            ' Para seguir el estado de tus pedidos, considera crear una cuenta.'
          )}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Icons.home className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <Link to="/orders">
              <Button className="w-full sm:w-auto">
                <Icons.bell className="h-4 w-4 mr-2" />
                Ver Mis Pedidos
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button className="w-full sm:w-auto">
                <Icons.register className="h-4 w-4 mr-2" />
                Crear Cuenta
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">¿Qué sigue?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Preparación</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Nuestro equipo está preparando tu pedido con los ingredientes más frescos.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Empaque</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Empacamos tu pedido cuidadosamente para mantener la temperatura y calidad.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Entrega</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Tu pedido será entregado en la dirección proporcionada lo más pronto posible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 