import axios from 'axios';

// Definición de la URL base para las peticiones al backend
// En despliegue, las peticiones a /api son manejadas por Vercel
// En desarrollo, se utiliza el proxy configurado en vite.config.ts
const API_URL = '/api';

// Interfaces para los datos de autenticación
export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  rol: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

// Clase para gestionar la autenticación
class AuthService {
  // Método para registrar un nuevo usuario
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }
  
  // Método para iniciar sesión
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      if (response.data.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }
  
  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  
  // Método para obtener el token JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  // Método para obtener la información del usuario actual
  getCurrentUser(): UserData | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService(); 