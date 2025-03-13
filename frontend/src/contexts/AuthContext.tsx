import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

// Definir el tipo de usuario
interface User {
  id: string;
  nombre: string;
  apellido?: string;
  email: string;
  rol: 'admin' | 'cliente';
  imagen_url?: string;
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
  setUser: (user: User) => void;
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
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
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
      // Usar el servicio real de autenticación
      console.log('Intentando iniciar sesión con:', { email, passwordLength: password.length });
      
      const response = await authService.login({ email, password });
      
      // Utilizar la respuesta real del backend
      const userData = response.user;
      const authToken = response.token;
      
      // Asegurar que el ID sea string
      const user: User = {
        id: String(userData.id),
        nombre: userData.nombre,
        email: userData.email,
        rol: userData.rol as 'admin' | 'cliente'
      };
      
      console.log('Login exitoso:', { user, hasToken: !!authToken });
      
      // Guardar en localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Actualizar el estado
      setUser(user);
      setToken(authToken);
    } catch (error) {
      console.error('Error en el login con el servicio real:', error);
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
    // Utilizar el servicio real
    authService.logout();
    
    // Actualizar el estado
    setUser(null);
    setToken(null);
  };

  // Función para actualizar datos del usuario
  const updateUser = (updatedUser: User) => {
    // Actualizar en localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Actualizar el estado
    setUser(updatedUser);
  };

  // Valor del contexto
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
    setUser: updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 