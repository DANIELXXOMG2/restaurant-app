import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir el tipo de usuario
interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'cliente';
}

// Definir el tipo del contexto de autenticación
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay un token guardado al cargar la página
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En una implementación real, aquí se haría una petición al backend
      // Por ahora, simulamos una respuesta exitosa con datos de ejemplo
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo para simular una respuesta exitosa
      if (email === 'admin@restaurante.com' && password === 'admin123') {
        const userData: User = {
          id: 1,
          nombre: 'Admin',
          apellido: 'Sistema',
          email: 'admin@restaurante.com',
          rol: 'admin'
        };
        
        const fakeToken = 'fake_jwt_token_' + Math.random().toString(36).substring(2);
        
        // Guardar en localStorage
        localStorage.setItem('auth_token', fakeToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        // Actualizar el estado
        setUser(userData);
        setToken(fakeToken);
      } else if (email === 'cliente@gmail.com' && password === 'cliente123') {
        const userData: User = {
          id: 2,
          nombre: 'Cliente',
          apellido: 'Ejemplo',
          email: 'cliente@gmail.com',
          rol: 'cliente'
        };
        
        const fakeToken = 'fake_jwt_token_' + Math.random().toString(36).substring(2);
        
        // Guardar en localStorage
        localStorage.setItem('auth_token', fakeToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        // Actualizar el estado
        setUser(userData);
        setToken(fakeToken);
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Eliminar del localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Actualizar el estado
    setUser(null);
    setToken(null);
  };

  // Valor del contexto
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 