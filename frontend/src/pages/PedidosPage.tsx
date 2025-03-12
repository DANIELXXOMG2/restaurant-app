import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Definir tipos para pedidos
interface PedidoItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Pedido {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  items: PedidoItem[];
}

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Aquí cargaríamos los pedidos desde el backend
    // Por ahora usaremos datos ficticios para la demostración
    setIsLoading(true);
    
    // Simulamos carga de datos
    setTimeout(() => {
      const pedidosFicticios = [
        {
          id: 1,
          fecha: '2024-03-12',
          estado: 'Entregado',
          total: 40000,
          items: [
            { nombre: 'Hamburguesa Clásica', cantidad: 2, precio: 15000 },
            { nombre: 'Coca-Cola', cantidad: 2, precio: 5000 }
          ]
        },
        {
          id: 2,
          fecha: '2024-03-10',
          estado: 'En preparación',
          total: 53000,
          items: [
            { nombre: 'Pizza Margarita', cantidad: 1, precio: 35000 },
            { nombre: 'Jugo Natural', cantidad: 1, precio: 7000 },
            { nombre: 'Helado de Vainilla', cantidad: 1, precio: 8000 }
          ]
        }
      ];
      
      setPedidos(pedidosFicticios);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
                    Fecha: {pedido.fecha}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  pedido.estado === 'Entregado' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {pedido.estado}
                </span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Productos:
                </h3>
                <ul className="space-y-2">
                  {pedido.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.cantidad}x {item.nombre}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        ${item.precio * item.cantidad}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <span className="font-bold text-gray-800 dark:text-white">Total:</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  ${pedido.total}
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