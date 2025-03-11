import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../icons';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-menu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center text-2xl font-display font-bold text-primary-600">
                <span className="text-primary-600 mr-1">🍔</span>
                <span>Sabor Express</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className={`${isActive('/') 
                  ? 'border-primary-500 text-primary-700' 
                  : 'border-transparent text-gray-500 hover:border-primary-300 hover:text-primary-600'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                <Icons.home className="h-5 w-5 mr-1" />
                Inicio
              </Link>
              <Link 
                to="/menu" 
                className={`${isActive('/menu') 
                  ? 'border-primary-500 text-primary-700' 
                  : 'border-transparent text-gray-500 hover:border-primary-300 hover:text-primary-600'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                <Icons.restaurant className="h-5 w-5 mr-1" />
                Menú
              </Link>
              <Link 
                to="/pedidos" 
                className={`${isActive('/pedidos') 
                  ? 'border-primary-500 text-primary-700' 
                  : 'border-transparent text-gray-500 hover:border-primary-300 hover:text-primary-600'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                <Icons.bookmark className="h-5 w-5 mr-1" />
                Pedidos
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link to="/carrito" className="p-1 rounded-full text-gray-600 hover:text-primary-600 relative transition-colors duration-200">
              <Icons.cart className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-accent-500 text-xs text-white font-bold flex items-center justify-center">
                0
              </span>
            </Link>
            
            {isAuthenticated ? (
              <div className="ml-4 relative flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Hola, {user?.nombre}
                </span>
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="border-primary-300 text-primary-600 hover:bg-primary-50"
                  >
                    <Icons.logout className="h-4 w-4 mr-1" />
                    Salir
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline" 
                size="sm"
                className="ml-4 border-primary-300 text-primary-600 hover:bg-primary-50"
                onClick={() => navigate('/login')}
              >
                <Icons.login className="h-4 w-4 mr-1" />
                Ingresar
              </Button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-600 hover:text-primary-800 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <Icons.close className="block h-6 w-6" />
              ) : (
                <Icons.menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`${isActive('/') 
              ? 'bg-primary-50 border-primary-500 text-primary-700' 
              : 'border-transparent text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'} 
              block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/menu"
            className={`${isActive('/menu') 
              ? 'bg-primary-50 border-primary-500 text-primary-700' 
              : 'border-transparent text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'} 
              block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsOpen(false)}
          >
            Menú
          </Link>
          <Link
            to="/pedidos"
            className={`${isActive('/pedidos') 
              ? 'bg-primary-50 border-primary-500 text-primary-700' 
              : 'border-transparent text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'} 
              block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsOpen(false)}
          >
            Pedidos
          </Link>
          <Link
            to="/carrito"
            className={`${isActive('/carrito') 
              ? 'bg-primary-50 border-primary-500 text-primary-700' 
              : 'border-transparent text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'} 
              block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsOpen(false)}
          >
            Carrito
          </Link>
          
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-left border-transparent text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              to="/login"
              className={`${isActive('/login') 
                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                : 'border-transparent text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'} 
                block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 