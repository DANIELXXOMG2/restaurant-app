import { Icons } from '../icons';

interface CartItemProps {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url: string;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartItem({
  id,
  nombre,
  precio,
  cantidad,
  imagen_url,
  onRemove,
  onUpdateQuantity
}: CartItemProps) {
  // Función para formatear el precio en pesos colombianos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const subtotal = precio * cantidad;

  const handleIncrement = () => {
    onUpdateQuantity(id, cantidad + 1);
  };

  const handleDecrement = () => {
    if (cantidad > 1) {
      onUpdateQuantity(id, cantidad - 1);
    } else {
      onRemove(id);
    }
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="h-20 w-20 flex-shrink-0">
        <img src={imagen_url} alt={nombre} className="h-full w-full object-cover rounded-md" />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">{nombre}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatPrice(precio)} c/u</p>
      </div>
      <div className="flex items-center">
        <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
          <button
            type="button"
            className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={handleDecrement}
          >
            <Icons.remove className="h-4 w-4" />
          </button>
          <span className="w-8 text-center py-1 dark:text-gray-300">{cantidad}</span>
          <button
            type="button"
            className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={handleIncrement}
          >
            <Icons.add className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="ml-4 text-right">
        <p className="text-base font-medium text-gray-900 dark:text-gray-100">{formatPrice(subtotal)}</p>
        <button
          type="button"
          className="mt-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          onClick={() => onRemove(id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
} 