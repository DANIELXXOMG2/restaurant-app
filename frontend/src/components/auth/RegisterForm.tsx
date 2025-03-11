import { FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Icons } from '../icons';

// Esquema de validación con Zod
const registerSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
  confirmPassword: z.string(),
  telefono: z.string().optional(),
  rol: z.enum(['cliente', 'administrador', 'empleado']).default('cliente'),
})
.refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Tipo inferido del esquema Zod
type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
}

export const RegisterForm: FC<RegisterFormProps> = ({ 
  onSubmit,
  isLoading = false 
}) => {
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      telefono: '',
      rol: 'cliente',
    },
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Card 
      title="Registro de Usuario"
      subtitle="Complete el formulario para crear una cuenta nueva"
      className="max-w-md w-full mx-auto"
    >
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
          <Icons.register className="h-10 w-10 text-blue-600" />
        </div>
      </div>
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              name="nombre"
              label="Nombre completo"
              type="text"
              placeholder="Ingresa tu nombre completo"
              validation={{ required: 'Este campo es obligatorio' }}
              className="pl-10"
            />
            <div className="absolute left-3 top-10">
              <Icons.user className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="relative">
            <Input
              name="email"
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
              validation={{ required: 'Este campo es obligatorio' }}
              className="pl-10"
            />
            <div className="absolute left-3 top-10">
              <Icons.email className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                name="telefono"
                label="Teléfono (opcional)"
                type="tel"
                placeholder="000-000-0000"
                className="pl-10"
              />
              <div className="absolute left-3 top-10">
                <Icons.call className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700 flex items-center gap-1">
                <Icons.userSettings className="h-5 w-5 text-gray-400" />
                Tipo de usuario
              </label>
              <select
                {...methods.register('rol')}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cliente">Cliente</option>
                <option value="empleado">Empleado</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </div>
          
          <div className="relative">
            <Input
              name="password"
              label="Contraseña"
              type="password"
              placeholder="********"
              validation={{ required: 'Este campo es obligatorio' }}
              className="pl-10"
            />
            <div className="absolute left-3 top-10">
              <Icons.password className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="relative">
            <Input
              name="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              placeholder="********"
              validation={{ required: 'Este campo es obligatorio' }}
              className="pl-10"
            />
            <div className="absolute left-3 top-10">
              <Icons.key className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 flex items-center gap-1">
              <Icons.info className="h-5 w-5" /> Requisitos de contraseña:
            </h4>
            <ul className="text-xs text-blue-600 mt-2 ml-6 list-disc">
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una letra mayúscula</li>
              <li>Al menos un número</li>
            </ul>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              fullWidth 
              isLoading={isLoading}
            >
              {!isLoading && <Icons.register className="h-5 w-5 mr-2" />}
              Crear cuenta
            </Button>
            
            <p className="mt-4 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 inline-flex items-center">
                <Icons.login className="h-4 w-4 mr-1" />
                Inicia sesión
              </a>
            </p>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}; 