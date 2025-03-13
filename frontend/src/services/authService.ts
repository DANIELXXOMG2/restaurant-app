import axios from 'axios';

// Configurar la URL base según la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || '/api';

console.log('Cargando variables de entorno');
console.log(`- API URL: ${API_URL}`);

// Configurar instancia de Axios con opciones avanzadas
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Necesario para CORS
});

// Añadir interceptor para manejar errores
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', error);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Interfaces para los datos de autenticación
export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  rol: string;
  imagen_url?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  imagen_url?: string;
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
      console.log('Enviando solicitud de registro a:', `${API_URL}/auth/register`);
      console.log('Datos:', userData);
      
      const response = await apiClient.post('/auth/register', userData);
      
      console.log('Respuesta recibida:', response.data);
      
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
      const response = await apiClient.post('/auth/login', credentials);
      
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