import { Link } from 'react-router-dom';
import { Icons } from '../components/icons';
import { Button } from '../components/ui/Button';
import { PageTitle } from '../components/ui/PageTitle';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

function FeatureCard({ icon, title, description, buttonText, buttonLink }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex flex-col h-full p-6">
      <div className="text-blue-600 dark:text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{description}</p>
      <div>
        <Link to={buttonLink} data-discover="true">
          <Button className="w-full">
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Inicio" />
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          Bienvenido a Pizza Daniel's
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Sistema de gestión completo para tu restaurante. Administra menús, pedidos y genera reportes de ventas con facilidad.
        </p>
      </section>

      {/* Características principales */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Características Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Icons.restaurant className="h-10 w-10" />}
            title="Gestión de Menú"
            description="Administra fácilmente los platos y categorías de tu restaurante. Actualiza precios y disponibilidad."
            buttonText="Ver Menú"
            buttonLink="/menu"
          />
          <FeatureCard
            icon={<Icons.bookmark className="h-10 w-10" />}
            title="Sistema de Pedidos"
            description="Registra y da seguimiento a los pedidos de tus clientes en tiempo real."
            buttonText="Gestionar Pedidos"
            buttonLink="/pedidos"
          />
          <FeatureCard
            icon={<Icons.payment className="h-10 w-10" />}
            title="Facturación"
            description="Genera facturas automáticamente para cada pedido y envíalas por correo electrónico."
            buttonText="Ver Facturas"
            buttonLink="/facturas"
          />
          <FeatureCard
            icon={<Icons.price className="h-10 w-10" />}
            title="Reportes"
            description="Analiza el rendimiento de tu negocio con reportes detallados de ventas."
            buttonText="Ver Reportes"
            buttonLink="/reportes"
          />
        </div>
      </section>

      {/* Llamada a la acción */}
      <section className="bg-blue-600 dark:bg-blue-800 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">¿Listo para empezar?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Explora todas las funcionalidades que nuestro sistema ofrece para mejorar la gestión de tu restaurante.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/menu">
            <Button className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-300">
              Ver Menú
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-300">
              Crear Cuenta
            </Button>
          </Link>
        </div>
      </section>

      {/* Estadísticas (simuladas) */}
      <section className="mt-12 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Nuestros Números</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">25+</div>
            <div className="text-gray-600 dark:text-gray-300">Platos en el Menú</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">5,000+</div>
            <div className="text-gray-600 dark:text-gray-300">Pedidos Completados</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">98%</div>
            <div className="text-gray-600 dark:text-gray-300">Clientes Satisfechos</div>
          </div>
        </div>
      </section>
    </div>
  );
} 