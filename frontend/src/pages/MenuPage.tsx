import React, { useState, useEffect } from 'react';
import { PageTitle } from '../components/ui/PageTitle';
import { ProductCard } from '../components/ui/ProductCard';
import { getPlatos, Plato } from '../services/platoService';
import { useCart } from '../contexts/CartContext';

export function MenuPage() {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const cargarPlatos = async () => {
      setIsLoading(true);
      try {
        const platosData = await getPlatos();
        setPlatos(platosData);
        
        // Extraer categorías únicas
        const categoriasUnicas = platosData.reduce((acc: { id: string; nombre: string }[], plato) => {
          if (!acc.some(cat => cat.id === plato.categoria_id) && plato.categoria_nombre) {
            acc.push({
              id: plato.categoria_id,
              nombre: plato.categoria_nombre
            });
          }
          return acc;
        }, []);
        
        setCategorias(categoriasUnicas);
        
        // Seleccionar la primera categoría por defecto
        if (categoriasUnicas.length > 0 && !categoriaSeleccionada) {
          setCategoriaSeleccionada(categoriasUnicas[0].id);
        }
      } catch (error) {
        console.error('Error al cargar platos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarPlatos();
  }, [categoriaSeleccionada]);

  // Filtrar platos por categoría
  const platosFiltrados = categoriaSeleccionada
    ? platos.filter(plato => plato.categoria_id === categoriaSeleccionada)
    : platos;

  // Función para agregar al carrito
  const handleAddToCart = (plato: Plato) => {
    addItem({
      id: plato.id,
      nombre: plato.nombre,
      precio: plato.precio,
      imagen_url: plato.imagen_url
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Menú" />
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Nuestro Menú</h1>
      
      {/* Filtro de categorías */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categorias.map(categoria => (
          <button
            key={categoria.id}
            onClick={() => setCategoriaSeleccionada(categoria.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              categoriaSeleccionada === categoria.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : platosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">No hay platos disponibles en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {platosFiltrados.map(plato => (
            <ProductCard
              key={plato.id}
              id={plato.id}
              nombre={plato.nombre}
              descripcion={plato.descripcion}
              precio={plato.precio}
              imagen_url={plato.imagen_url}
              onAddToCart={() => handleAddToCart(plato)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 