import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../icons';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ThemeSwitch } from './ThemeSwitch';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemsCount } = useCart();
  
  // Añadimos un efecto para detectar el scroll de la página
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Efecto para prevenir el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Agregar un div espaciador para evitar saltos en el contenido */}
      <div className="h-16"></div>
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 py-1' 
          : 'bg-white dark:bg-gray-800'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className={`flex items-center text-2xl font-display font-bold text-primary-600 dark:text-primary-400 transition-all duration-300 ${scrolled ? 'scale-95' : ''}`}>
                <span className="text-primary-600 dark:text-primary-400 mr-1">🍔</span>
                <span>Pizza Daniel's</span>
              </Link>
            </div>
            <div className="hidden sm:flex sm:items-center sm:gap-6">
              <Link 
                to="/" 
                className={`${isActive('/') 
                  ? 'border-primary-500 text-primary-700 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-primary-300 hover:text-primary-600 dark:hover:text-primary-400'} 
                  inline-flex items-center justify-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                <Icons.home className="h-5 w-5 mr-1.5" />
                Inicio
              </Link>
              <Link 
                to="/menu" 
                className={`${isActive('/menu') 
                  ? 'border-primary-500 text-primary-700 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-primary-300 hover:text-primary-600 dark:hover:text-primary-400'} 
                  inline-flex items-center justify-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                <Icons.restaurant className="h-5 w-5 mr-1.5" />
                Menú
              </Link>
              <Link 
                to="/pedidos" 
                className={`${isActive('/pedidos') 
                  ? 'border-primary-500 text-primary-700 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-primary-300 hover:text-primary-600 dark:hover:text-primary-400'} 
                  inline-flex items-center justify-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                <Icons.bookmark className="h-5 w-5 mr-1.5" />
                Pedidos
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-8 sm:flex sm:items-center sm:gap-6">
            <ThemeSwitch className="p-2.5" />
            
            <Link to="/carrito" className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 relative transition-colors duration-200">
              <Icons.cart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-accent-500 text-xs text-white font-bold flex items-center justify-center">
                {itemsCount}
              </span>
            </Link>
            
            {isAuthenticated ? (
              <div className="relative flex items-center gap-4 ml-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hola, {user?.nombre}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="border-primary-300 text-primary-600 dark:text-primary-400 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 px-4"
                >
                  <Icons.logout className="h-4 w-4 mr-1.5" />
                  Salir
                </Button>
              </div>
            ) : (
              <Button
                variant="outline" 
                size="sm"
                className="border-primary-300 text-primary-600 dark:text-primary-400 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 px-4"
                onClick={handleLogin}
              >
                <div className="flex items-center justify-center w-full z-50">
                  <Icons.login className="h-4 w-4 mr-1.5" />
                  <span>Ingresar</span>
                </div>
              </Button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <ThemeSwitch />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-white dark:bg-gray-800 shadow-lg`}>
        <div className="pt-2 pb-3 flex flex-col gap-1">
          <Link
            to="/"
            className={`${isActive('/') 
              ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400' 
              : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-400'} 
              flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsOpen(false)}
          >
            <Icons.home className="h-5 w-5 mr-2" />
            Inicio
          </Link>
          <Link
            to="/menu"
            className={`${isActive('/menu') 
              ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400' 
              : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-400'} 
              flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsOpen(false)}
          >
            <Icons.restaurant className="h-5 w-5 mr-2" />
            Menú
          </Link>
          <Link
            to="/pedidos"
            className={`${isActive('/pedidos') 
              ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400' 
              : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-400'} 
              flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsOpen(false)}
          >
            <Icons.bookmark className="h-5 w-5 mr-2" />
            Pedidos
          </Link>
          <Link
            to="/carrito"
            className={`${isActive('/carrito') 
              ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400' 
              : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-400'} 
              flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsOpen(false)}
          >
            <Icons.cart className="h-5 w-5 mr-2" />
            Carrito
          </Link>
          
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-left flex items-center border-transparent text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-400 pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              <Icons.logout className="h-5 w-5 mr-2" />
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={() => {
                handleLogin();
                setIsOpen(false);
              }}
              className="w-full text-left flex items-center border-transparent text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-400 pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              <Icons.login className="h-5 w-5 mr-2" />
              Ingresar
            </button>
          )}
        </div>
      </div>
    </nav>
    </>
  );
} 
