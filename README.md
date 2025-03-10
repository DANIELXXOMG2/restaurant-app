# Proyecto Flask + React

Este proyecto combina un frontend en React con TypeScript y un backend en Django posiblemente (Python).

## Estructura del Proyecto

```
├── README.md                   # Documentación principal del proyecto
├── .gitignore                  # Archivos a ignorar por git
├── package.json                # Dependencias y scripts de frontend
├── tsconfig.json               # Configuración de TypeScript
│
├── frontend/                   # Carpeta de código frontend (React/TypeScript)
│   ├── src/                    # Código fuente de React
│   │   ├── assets/             # Imágenes, fuentes y otros recursos estáticos
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas/vistas de la aplicación
│   │   ├── services/           # Servicios para conexión con API
│   │   ├── utils/              # Funciones utilitarias
│   │   ├── App.tsx             # Componente principal de la aplicación
│   │   ├── main.tsx            # Punto de entrada de React
│   │   └── ...                 # Otros archivos de configuración
│   │
│   ├── public/                 # Archivos públicos accesibles directamente
│   ├── index.html              # Plantilla HTML para la aplicación
│   └── vite.config.ts          # Configuración de Vite
│
├── backend/                    # Carpeta de código backend (Flask/Python)
│   ├── app/                    # Código principal de la aplicación Flask
│   │   ├── __init__.py         # Inicialización de la aplicación Flask
│   │   ├── config.py           # Configuraciones del backend
│   │   ├── models/             # Modelos de datos y esquemas
│   │   ├── routes/             # Rutas y controladores de la API 
│   │   ├── services/           # Servicios y lógica de negocio
│   │   └── utils/              # Funciones utilitarias
│   │
│   ├── migrations/             # Migraciones de base de datos (si aplica)
│   ├── tests/                  # Pruebas unitarias y de integración
│   ├── .env                    # Variables de entorno (no incluir en git)
│   ├── .flaskenv               # Variables de entorno para Flask
│   ├── requirements.txt        # Dependencias de Python
│   └── run.py                  # Script para ejecutar la aplicación
│
└── db/                         # Archivos relacionados con la base de datos (scripts, backups, etc.)
```

## Configuración del Entorno

### Requisitos previos
- Python 3.8+
- Node.js 18+
- npm o yarn

### Configuración del Backend (Flask)
1. Crear un entorno virtual de Python:
   ```
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. Instalar dependencias:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Configurar variables de entorno en `.env` y `.flaskenv`

4. Ejecutar el servidor de desarrollo:
   ```
   python run.py
   ```

### Configuración del Frontend (React)
1. Instalar dependencias:
   ```
   cd frontend
   npm install
   ```

2. Ejecutar el servidor de desarrollo:
   ```
   npm run dev
   ```

## Desarrollo

- El backend estará disponible en `http://localhost:5000`
- El frontend estará disponible en `http://localhost:5173`
- Para realizar peticiones al backend desde el frontend, se recomienda configurar un proxy en `vite.config.ts`

## Despliegue

Para preparar la aplicación para producción:

1. Construir el frontend:
   ```
   cd frontend
   npm run build
   ```

2. Configurar el backend para servir los archivos estáticos generados
