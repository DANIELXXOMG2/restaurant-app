import { FC, InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Extender las propiedades nativas de input y textarea
interface InputBaseProps {
  label?: string;
  error?: string;
  multiline?: boolean;
  className?: string;
}

type InputProps = InputBaseProps & 
  (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>);

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

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, multiline = false, className = '', ...props }, ref) => {
    const isInvalid = !!error;
    
    return (
      <div className={`flex flex-col w-full gap-1 ${className}`}>
        {label && (
          <div className="flex justify-between">
            <label htmlFor={props.id || props.name} className="font-medium text-gray-700">
              {label}
            </label>
            <AnimatePresence mode="wait" initial={false}>
              {isInvalid && (
                <InputError
                  message={error!}
                  key={error}
                />
              )}
            </AnimatePresence>
          </div>
        )}
        
        {!label && isInvalid && (
          <AnimatePresence mode="wait" initial={false}>
            <InputError
              message={error!}
              key={error}
            />
          </AnimatePresence>
        )}
        
        {multiline ? (
          <textarea
            className={`w-full p-3 border rounded-md ${
              isInvalid ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            rows={4}
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            {...props as TextareaHTMLAttributes<HTMLTextAreaElement>}
          />
        ) : (
          <input
            className={`w-full p-3 border rounded-md ${
              isInvalid ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            ref={ref as React.RefObject<HTMLInputElement>}
            {...props as InputHTMLAttributes<HTMLInputElement>}
          />
        )}
      </div>
    );
  }
); 