import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { Icons } from './components/icons';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="flex items-center text-2xl font-bold text-blue-600">
                    <Icons.logo className="h-8 w-8 mr-2 text-blue-600" />
                    <span>RestauranteApp</span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link 
                    to="/" 
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Icons.home className="h-5 w-5 mr-1" />
                    Inicio
                  </Link>
                  <Link 
                    to="/menu" 
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Icons.restaurant className="h-5 w-5 mr-1" />
                    Menú
                  </Link>
                  <Link 
                    to="/reservas" 
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Icons.calendar className="h-5 w-5 mr-1" />
                    Reservas
                  </Link>
                  <Link 
                    to="/ubicacion" 
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Icons.location className="h-5 w-5 mr-1" />
                    Ubicación
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
                <Link 
                  to="/cart" 
                  className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <Icons.cart className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">3</span>
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Icons.login className="h-5 w-5 mr-1" />
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Icons.register className="h-5 w-5 mr-1" />
                  Registrarse
                </Link>
              </div>
              {/* Menú móvil (hamburguesa) */}
              <div className="flex items-center sm:hidden">
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <Icons.menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Otras rutas de la aplicación */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Página de inicio mejorada con iconos
const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Banner principal */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-lg mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">¡Bienvenido a nuestro Restaurante!</h1>
        <p className="text-xl text-blue-100 mb-8">
          Disfruta de la mejor experiencia gastronómica con nosotros.
        </p>
        <div className="flex space-x-4">
          <Link to="/menu" className="inline-flex items-center bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg text-lg font-medium shadow-md transition-colors">
            <Icons.restaurant className="h-6 w-6 mr-2" />
            Ver Menú
          </Link>
          <Link to="/reservas" className="inline-flex items-center bg-blue-500 text-white hover:bg-blue-400 px-6 py-3 rounded-lg text-lg font-medium shadow-md transition-colors">
            <Icons.calendar className="h-6 w-6 mr-2" />
            Reservar Mesa
          </Link>
        </div>
      </div>
      
      {/* Secciones destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Platos Populares */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Icons.pizza className="h-8 w-8 text-orange-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Platos Populares</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Descubre nuestros platos más solicitados por los clientes.
          </p>
          <Link to="/menu/populares" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Ver platos populares
            <Icons.chevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        {/* Promociones */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Icons.price className="h-8 w-8 text-green-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Promociones</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Aprovecha nuestras ofertas especiales y descuentos del día.
          </p>
          <Link to="/promociones" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Ver promociones
            <Icons.chevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        {/* Ubicación */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Icons.map className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Ubicación</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Encuéntranos fácilmente en el centro de la ciudad.
          </p>
          <Link to="/ubicacion" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Cómo llegar
            <Icons.chevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;
