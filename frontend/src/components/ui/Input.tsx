import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  validation?: Record<string, any>;
  className?: string;
  multiline?: boolean;
}

// Componente para mostrar mensajes de error
const InputError: FC<{ message: string }> = ({ message }) => {
  return (
    <motion.p
      className="text-sm text-red-500 font-medium"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {message}
    </motion.p>
  );
};

// Función auxiliar para encontrar errores en el formulario
const findInputError = (errors: Record<string, any>, name: string) => {
  const filtered = Object.keys(errors)
    .filter(key => key === name)
    .reduce((obj, key) => {
      return {
        ...obj,
        error: errors[key]
      };
    }, {});
  return filtered;
};

// Función auxiliar para verificar si un input tiene un error
const isFormInvalid = (err: Record<string, any>) => {
  return Object.keys(err).length > 0;
};

export const Input: FC<InputProps> = ({
  label,
  name,
  type,
  placeholder,
  validation,
  className = '',
  multiline = false
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputError = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputError);

  return (
    <div className={`flex flex-col w-full gap-1 ${className}`}>
      <div className="flex justify-between">
        <label htmlFor={name} className="font-medium text-gray-700 capitalize">
          {label}
        </label>
        <AnimatePresence mode="wait" initial={false}>
          {isInvalid && (
            <InputError
              message={inputError.error.message}
              key={inputError.error.message}
            />
          )}
        </AnimatePresence>
      </div>
      
      {multiline ? (
        <textarea
          id={name}
          className={`w-full p-3 border rounded-md ${
            isInvalid ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder={placeholder}
          rows={4}
          {...register(name, validation)}
        />
      ) : (
        <input
          id={name}
          type={type}
          className={`w-full p-3 border rounded-md ${
            isInvalid ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder={placeholder}
          {...register(name, validation)}
        />
      )}
    </div>
  );
}; 