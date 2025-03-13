import { Button } from './Button';
import { Card } from './Card';
import { Icons } from '../icons';
import { getImageProxy } from '../../services/s3Service';
import { useEffect, useState } from 'react';

interface ProductCardProps {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  disponible?: boolean;
  categoria?: string;
  onAddToCart: (id: string) => void;
}

export function ProductCard({
  id,
  nombre,
  descripcion,
  precio,
  imagen_url,
  disponible = true,
  categoria,
  onAddToCart
}: ProductCardProps) {
  const [imageUrl, setImageUrl] = useState<string>(
    'https://via.placeholder.com/300x200?text=Cargando...'
  );
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    // Usar directamente la función getImageProxy para todas las imágenes
    // para evitar problemas de CORS
    try {
      setImageUrl(getImageProxy(imagen_url));
    } catch (error) {
      console.error('Error al procesar la URL de la imagen:', error);
      setImageError(true);
    }
  }, [imagen_url]);

  const handleAddToCart = () => {
    if (onAddToCart && disponible) {
      onAddToCart(id);
    }
  };

  const handleImageError = () => {
    if (!imageError) {
      // Si hay un error al cargar la imagen, usar un placeholder
      setImageError(true);
      setImageUrl(`https://via.placeholder.com/300x200?text=${encodeURIComponent(nombre)}`);
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
    <Card className="overflow-hidden flex flex-col h-full border border-primary-100 shadow-card hover:shadow-lg transition-shadow duration-300 rounded-xl dark:border-primary-700 dark:bg-gray-800">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={nombre} 
          className="w-full h-48 object-cover rounded-t-xl"
          onError={handleImageError}
        />
        {categoria && (
          <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {categoria}
          </div>
        )}
        {!disponible && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center rounded-t-xl">
            <span className="text-white font-bold text-lg">No Disponible</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{nombre}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">{descripcion}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatPrice(precio)}</span>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleAddToCart}
            disabled={!disponible}
            className={!disponible ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Icons.cart className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>
    </Card>
  );
} 