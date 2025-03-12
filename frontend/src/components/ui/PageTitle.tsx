import { useEffect } from 'react';

interface PageTitleProps {
  title: string;
}

/**
 * Componente que actualiza el título de la página dinámicamente
 * @param title Título específico de la página
 */
export function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    // Actualiza el título de la página
    const baseTitle = 'Pizza Daniel\'s';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
    
    // Restaura el título original cuando el componente se desmonte
    return () => {
      document.title = baseTitle;
    };
  }, [title]);

  // Este componente no renderiza ningún elemento en la interfaz
  return null;
} 