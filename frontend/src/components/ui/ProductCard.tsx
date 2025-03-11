import { Button } from './Button';
import { Card } from './Card';
import { Icons } from '../icons';

interface ProductCardProps {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  disponible: boolean;
  categoria: string;
  onAddToCart?: (id: number) => void;
}

export function ProductCard({
  id,
  nombre,
  descripcion,
  precio,
  imagen_url,
  disponible,
  categoria,
  onAddToCart
}: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  // Función para formatear el precio en pesos colombianos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full border border-primary-100 shadow-card hover:shadow-lg transition-shadow duration-300 rounded-xl">
      <div className="relative">
        <img 
          src={imagen_url} 
          alt={nombre} 
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {categoria}
        </div>
        {!disponible && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center rounded-t-xl">
            <span className="text-white font-bold text-lg">No Disponible</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1 font-display">{nombre}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{descripcion}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="relative">
            <span className="text-xl font-bold text-primary-600">{formatPrice(precio)}</span>
            {Math.random() > 0.7 && (
              <div className="absolute -top-3 -right-3 bg-accent-500 text-white text-xs font-bold py-0.5 px-2 rounded-md transform rotate-3 shadow-sm">
                ¡Oferta!
              </div>
            )}
          </div>
          <Button 
            onClick={handleAddToCart} 
            disabled={!disponible}
            size="sm"
            variant="primary"
            className="rounded-full px-4"
          >
            <Icons.cart className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
        
        {/* Indicador de popularidad */}
        {Math.random() > 0.6 && (
          <div className="flex items-center mt-3 text-xs text-gray-500">
            <Icons.favorite className="h-4 w-4 text-primary-500 mr-1" />
            <span>¡Uno de los más pedidos!</span>
          </div>
        )}
      </div>
    </Card>
  );
} 