# Frontend para Aplicación de Restaurante

Este proyecto frontend está construido con Vite, React, TypeScript y Shadcn UI para proporcionar una interfaz moderna y atractiva para la gestión de restaurante de comida rápida.

## Tecnologías Principales

- **Vite**: Herramienta de construcción ultrarrápida para desarrollo moderno con React
- **React**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Superset tipado de JavaScript para mejorar la calidad del código
- **Shadcn UI**: Componentes de interfaz reutilizables basados en Radix UI y Tailwind CSS
- **Lucide Icons**: Biblioteca de iconos modernos para React
- **Framer Motion**: Biblioteca para animaciones fluidas en React
- **React Hot Toast**: Sistema de notificaciones elegante
- **Recharts**: Biblioteca para crear visualizaciones y gráficos
- **React DnD**: Implementación de arrastrar y soltar para React

## Características del Frontend

- Gestión completa de menú y promociones
- Sistema de pedidos online con carrito de compras
- Gestión de reservas de mesas
- Visualización de facturas e informes
- Panel de administración para el personal
- Diseño responsivo para acceso desde cualquier dispositivo

## Estructura del Proyecto

```
frontend/
├── src/                    # Código fuente principal
│   ├── assets/             # Imágenes, fuentes y recursos estáticos
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/             # Componentes de Shadcn UI
│   │   ├── icons.tsx       # Componente centralizado de iconos
│   │   └── ...             # Otros componentes específicos
│   ├── context/            # Contextos de React (auth, carrito, etc.)
│   ├── hooks/              # Hooks personalizados
│   ├── lib/                # Utilidades y funciones auxiliares
│   ├── pages/              # Componentes de páginas/rutas
│   │   ├── admin/          # Páginas de administración
│   │   ├── menu/           # Páginas de menú
│   │   ├── orders/         # Páginas de pedidos
│   │   └── ...             # Otras páginas
│   ├── services/           # Servicios para conexión con la API
│   ├── utils/              # Funciones utilitarias
│   ├── App.tsx             # Componente principal que define rutas
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos públicos accesibles directamente
├── index.html              # Plantilla HTML para la aplicación
├── tailwind.config.js      # Configuración de Tailwind CSS
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración de Vite
```

## Instalación

### Requisitos previos
- Node.js 18+ y npm/pnpm/yarn

### Comando de instalación completo

Para instalar todas las dependencias necesarias, incluyendo las bibliotecas adicionales (Lucide Icons, Framer Motion, React Hot Toast, Recharts, React DnD), ejecuta:

```bash
cd frontend
npm install react-router-dom tailwindcss postcss autoprefixer class-variance-authority clsx tailwind-merge react-hook-form zod @hookform/resolvers @tanstack/react-query axios date-fns lucide-react framer-motion react-hot-toast recharts react-dnd react-dnd-html5-backend
```

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Configuración de bibliotecas

### 1. Lucide Icons

[Lucide Icons](https://lucide.dev) es la biblioteca de iconos recomendada para Shadcn UI.

#### Configuración básica

No se requiere configuración adicional, solo es necesario importar los iconos que necesites.

#### Ejemplo de uso

```tsx
import { Menu, ShoppingCart, User, Settings } from 'lucide-react';

function MyComponent() {
  return (
    <div>
      <Menu className="h-6 w-6" />
      <ShoppingCart className="h-6 w-6 text-primary" />
      <Button>
        <User className="mr-2 h-4 w-4" /> Perfil
      </Button>
    </div>
  );
}
```

#### Componente de iconos centralizado

Se recomienda crear un archivo `components/icons.tsx` para centralizar todos los iconos:

```tsx
// components/icons.tsx
import { 
  Menu, 
  ShoppingCart, 
  User, 
  Settings,
  // Añade más iconos según sea necesario
} from 'lucide-react';

export const Icons = {
  Menu,
  ShoppingCart,
  User,
  Settings,
  // Exporta todos los iconos que necesites
};
```

Luego importa desde este archivo:

```tsx
import { Icons } from '@/components/icons';

function MyComponent() {
  return <Icons.ShoppingCart className="h-6 w-6" />;
}
```

### 2. Framer Motion

[Framer Motion](https://www.framer.com/motion/) es una biblioteca para añadir animaciones fluidas a tus componentes.

#### Ejemplo de uso

```tsx
import { motion } from 'framer-motion';

function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Contenido animado
    </motion.div>
  );
}
```

#### Componente de tarjeta animada para el menú

```tsx
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

function MenuItemCard({ item }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card>
        <CardContent>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p className="text-primary font-bold">${item.price}</p>
        </CardContent>
        <CardFooter>
          <Button>Añadir al carrito</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
```

### 3. React Hot Toast

[React Hot Toast](https://react-hot-toast.com/) proporciona notificaciones elegantes para tu aplicación.

#### Configuración

Añade el provider en tu componente principal `App.tsx`:

```tsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      {/* Resto de tu aplicación */}
      <Toaster position="top-right" />
    </>
  );
}
```

#### Ejemplo de uso

```tsx
import toast from 'react-hot-toast';

function OrderButton() {
  const handleOrder = () => {
    toast.promise(
      submitOrder(), // Función que devuelve una promesa
      {
        loading: 'Procesando pedido...',
        success: 'Pedido realizado con éxito!',
        error: 'Error al procesar el pedido',
      }
    );
  };

  return <Button onClick={handleOrder}>Realizar pedido</Button>;
}
```

### 4. Recharts

[Recharts](https://recharts.org/) es una biblioteca para crear gráficos en React.

#### Ejemplo de uso para un gráfico de ventas diarias

```tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Lunes', ventas: 4000 },
  { name: 'Martes', ventas: 3000 },
  { name: 'Miércoles', ventas: 5000 },
  // ...resto de datos
];

function SalesChart() {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ventas"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 5. React DnD (Drag and Drop)

[React DnD](https://react-dnd.github.io/react-dnd/) permite implementar funcionalidad de arrastrar y soltar.

#### Configuración

Primero, configura el provider en tu aplicación principal:

```tsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      {/* Resto de tu aplicación */}
    </DndProvider>
  );
}
```

#### Ejemplo de componente arrastrable para reordenar menú

```tsx
import { useDrag, useDrop } from 'react-dnd';

// Componente arrastrable
function DraggableMenuItem({ id, index, text, moveItem }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'MENU_ITEM',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'MENU_ITEM',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="p-4 mb-2 bg-white rounded shadow cursor-move"
    >
      {text}
    </div>
  );
}
```

## Conexión con el Backend

El frontend se comunica con el backend Flask a través de su API REST. La configuración base está disponible en el servicio API dentro de `src/services/api.ts`.

Para desarrollo local, configura el proxy en `vite.config.ts`:

```typescript
export default defineConfig({
  // ... otras configuraciones
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la versión de producción
- `npm run lint`: Ejecuta ESLint
- `npm run format`: Formatea el código con Prettier

## Despliegue

Para desplegar el frontend en Vercel:

1. Construye la aplicación: `npm run build`
2. Instala Vercel CLI: `npm install -g vercel`
3. Despliega en Vercel: `vercel`

También puedes conectar tu repositorio directamente a Vercel para despliegues automáticos. 