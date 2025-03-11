import { useState, useEffect, ReactNode } from 'react';
import { ProductCard } from '../components/ui/ProductCard';
import { Icons } from '../components/icons';
import { Button } from '../components/ui/Button';

// Interfaces para los tipos de datos
interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  imagen_url: string;
  disponible: boolean;
}

// Datos de ejemplo (mientras se implementa la conexión con la API)
const categoriasEjemplo: Categoria[] = [
  {
    id: 1,
    nombre: 'Hamburguesas',
    descripcion: 'Deliciosas hamburguesas de carne y vegetarianas',
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/categorias/hamburguesas.jpg'
  },
  {
    id: 2,
    nombre: 'Pizzas',
    descripcion: 'Pizzas con diferentes ingredientes y tamaños',
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/categorias/pizzas.jpg'
  },
  {
    id: 3,
    nombre: 'Bebidas',
    descripcion: 'Refrescos, jugos naturales y bebidas calientes',
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/categorias/bebidas.jpg'
  },
  {
    id: 4,
    nombre: 'Postres',
    descripcion: 'Deliciosos postres y helados',
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/categorias/postres.jpg'
  }
];

const productosEjemplo: Producto[] = [
  {
    id: 1,
    nombre: 'Hamburguesa Clásica',
    descripcion: 'Hamburguesa con carne de res, lechuga, tomate y queso',
    precio: 15000,
    categoria_id: 1,
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/hamburguesa-clasica.jpg',
    disponible: true
  },
  {
    id: 2,
    nombre: 'Hamburguesa Doble',
    descripcion: 'Doble carne, doble queso y tocineta',
    precio: 25000,
    categoria_id: 1,
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/hamburguesa-doble.jpg',
    disponible: true
  },
  {
    id: 3,
    nombre: 'Pizza Margarita',
    descripcion: 'Pizza con salsa de tomate, queso mozzarella y albahaca',
    precio: 35000,
    categoria_id: 2,
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/pizza-margarita.jpg',
    disponible: true
  },
  {
    id: 4,
    nombre: 'Pizza Pepperoni',
    descripcion: 'Pizza con pepperoni y queso',
    precio: 40000,
    categoria_id: 2,
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/pizza-pepperoni.jpg',
    disponible: true
  },
  {
    id: 5,
    nombre: 'Coca-Cola',
    descripcion: 'Refresco de cola 500ml',
    precio: 5000,
    categoria_id: 3,
    imagen_url: 'https://restaurant-items-by-danielxxomg.s3.amazonaws.com/platos/coca-cola.jpg',
    disponible: true
  }
];

export function MenuPage() {
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasEjemplo);
  const [productos, setProductos] = useState<Producto[]>(productosEjemplo);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función que simula la conexión con la API (se reemplazará cuando esté listo el backend)
  useEffect(() => {
    // Aquí se implementará la llamada a la API para obtener categorías y productos
    // Por ahora usamos los datos de ejemplo
    setIsLoading(true);
    
    // Simulamos un delay para mostrar el estado de carga
    const timer = setTimeout(() => {
      setCategorias(categoriasEjemplo);
      setProductos(productosEjemplo);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Función para agregar productos al carrito (simulada por ahora)
  const handleAddToCart = (id: number) => {
    console.log(`Producto ${id} agregado al carrito`);
    // Aquí se implementará la lógica para agregar al carrito
  };

  // Filtrar productos por categoría y búsqueda
  const productosFiltrados = productos.filter(producto => {
    const matchesCategoria = categoriaSeleccionada ? producto.categoria_id === categoriaSeleccionada : true;
    const matchesBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return matchesCategoria && matchesBusqueda;
  });

  // Obtener el nombre de la categoría por su ID
  const getCategoryName = (categoryId: number) => {
    const category = categorias.find(cat => cat.id === categoryId);
    return category ? category.nombre : '';
  };

  // Obtener icono correspondiente a la categoría
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, ReactNode> = {
      'Hamburguesas': <Icons.sandwich className="h-5 w-5" />,
      'Pizzas': <Icons.pizza className="h-5 w-5" />,
      'Bebidas': <Icons.coffee className="h-5 w-5" />,
      'Postres': <Icons.dessert className="h-5 w-5" />
    };
    
    return iconMap[categoryName] || <Icons.restaurant className="h-5 w-5" />;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="text-2xl text-primary-500 mb-2">Saborea la Diferencia</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">Nuestro Menú</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubre el sabor inigualable de nuestra comida preparada con ingredientes frescos y recetas exclusivas.
        </p>
      </div>
      
      {/* Barra de búsqueda y filtros */}
      <div className="mb-12 space-y-6">
        <div className="max-w-md mx-auto">
          <div className="relative flex w-full items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar platillos, ingredientes..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            className={`rounded-full px-5 py-2.5 opacity-70 hover:opacity-100 transition-all border-gray-300 ${
              categoriaSeleccionada === null 
                ? 'bg-gray-900 text-white border-transparent opacity-100'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => setCategoriaSeleccionada(null)}
          >
            <Icons.restaurant className="h-5 w-5 mr-2" />
            Todos
          </Button>
          
          {categorias.map(categoria => (
            <Button
              key={categoria.id}
              variant="outline"
              className={`rounded-full px-5 py-2.5 opacity-70 hover:opacity-100 transition-all border-gray-300 ${
                categoriaSeleccionada === categoria.id 
                  ? 'bg-gray-900 text-white border-transparent opacity-100'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => setCategoriaSeleccionada(categoria.id)}
            >
              {getCategoryIcon(categoria.nombre)}
              <span className="ml-2">{categoria.nombre}</span>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Contenido principal - Lista de productos */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
          <span className="ml-2 text-gray-600">Cargando menú...</span>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <Icons.alert className="h-16 w-16 mx-auto text-primary-300" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">No se encontraron productos</h3>
          <p className="mt-2 text-gray-500">Intenta cambiar los filtros o la búsqueda.</p>
          <Button 
            variant="outline" 
            className="mt-6 border-primary-300"
            onClick={() => {
              setBusqueda('');
              setCategoriaSeleccionada(null);
            }}
          >
            Restablecer filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productosFiltrados.map(producto => (
            <ProductCard
              key={producto.id}
              id={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              precio={producto.precio}
              imagen_url={producto.imagen_url}
              disponible={producto.disponible}
              categoria={getCategoryName(producto.categoria_id)}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
} 