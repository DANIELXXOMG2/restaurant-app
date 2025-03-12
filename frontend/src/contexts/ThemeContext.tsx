import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Intentar obtener la preferencia del usuario desde localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Si estamos en el servidor, devolver false por defecto
    if (typeof window === 'undefined') return false;
    
    const savedTheme = localStorage.getItem('theme');
    // Si ya tiene una preferencia guardada, usarla
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Si no hay preferencia guardada, usar la preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Aplicar el tema cuando cambie
  useEffect(() => {
    // Si estamos en el servidor, no hacer nada
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    console.log('Cambiando tema a:', isDarkMode ? 'dark' : 'light');
    
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    // Si estamos en el servidor, no hacer nada
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar si no hay preferencia guardada
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Función para alternar entre modos
  const toggleTheme = () => {
    console.log('Toggle theme llamado, cambiando de', isDarkMode, 'a', !isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
} 