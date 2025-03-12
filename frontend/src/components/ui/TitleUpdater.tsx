import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que actualiza automáticamente el título de la página
 * basado en la ruta actual
 */
export function TitleUpdater() {
  const location = useLocation();
  
  useEffect(() => {
    // Título base de la aplicación
    const baseTitle = 'Pizza Daniel\'s';
    
    // Mapeo de rutas a títulos específicos
    const titleMap: Record<string, string> = {
      '/': 'Inicio',
      '/menu': 'Menú',
      '/carrito': 'Carrito de Compras',
      '/login': 'Iniciar Sesión',
      '/register': 'Crear Cuenta',
      '/pedidos': 'Mis Pedidos',
      '/promociones': 'Promociones',
      '/locales': 'Nuestros Locales'
    };
    
    // Obtener el título correspondiente a la ruta actual
    const routeTitle = titleMap[location.pathname];
    
    // Actualizar el título del documento
    document.title = routeTitle
      ? `${routeTitle} | ${baseTitle}`
      : baseTitle;
  }, [location]);
  
  // Este componente no renderiza elementos visibles
  return null;
} 