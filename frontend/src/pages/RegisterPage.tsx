import { FC, useState } from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import authService, { RegisterData } from '../services/authService';
import { AxiosError } from 'axios';

// Definimos el tipo directamente sin crear un esquema Zod completo
type RegisterFormData = {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono?: string;
  rol: 'cliente' | 'administrador' | 'empleado';
};

// Interfaz para el formato de error de la API
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export const RegisterPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar el envío del formulario
  const handleRegister = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Preparamos los datos para enviar al servicio sin incluir confirmPassword
      const registerData: RegisterData = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: data.rol,
      };
      
      // Si hay teléfono, lo incluimos
      if (data.telefono) {
        registerData.telefono = data.telefono;
      }
      
      // Llamamos al servicio de autenticación
      await authService.register(registerData);
      
      // Redirigir o mostrar mensaje de éxito
      alert('¡Registro exitoso! Puedes iniciar sesión ahora.');
      
      // Aquí podríamos redirigir a otra página
      // window.location.href = '/login';
      
    } catch (error) {
      console.error('Error al registrar:', error);
      
      // Tipamos el error para acceder a la respuesta
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      // Extraemos el mensaje de error de la respuesta
      const errorMessage = axiosError.response?.data?.message || 
                          'Ocurrió un error al registrar. Por favor intenta nuevamente.';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Regístrate para disfrutar de nuestros servicios
        </p>
      </div>

      {error && (
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
      </div>
    </div>
  );
}; 