# Instrucciones para Despliegue

## Requisitos Previos

- Node.js 18+ instalado
- Cuenta en Vercel
- Cuenta en CockroachDB
- Git instalado

## Configuración Local

### 1. Clonar el repositorio

```powershell
git clone <tu-repositorio>
cd restaurant-app
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basado en el ejemplo:

```powershell
# En la carpeta backend
cd backend
copy .env.example .env
# Edita el archivo .env con tus credenciales
```

### 3. Instalar dependencias

```powershell
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 4. Compilar el backend

```powershell
cd ../backend
npm run build
```

### 5. Ejecutar localmente

```powershell
# Iniciar el backend en desarrollo
npm run dev

# En otra terminal, iniciar el frontend
cd ../frontend
npm run dev
```

El backend estará disponible en `http://localhost:3001` y el frontend en `http://localhost:5173`.

## Despliegue en Vercel

### 1. Configuración de Vercel CLI

Instala Vercel CLI globalmente:

```powershell
npm install -g vercel
```

### 2. Iniciar sesión en Vercel

```powershell
vercel login
```

### 3. Configurar el proyecto para Vercel

```powershell
# En la raíz del proyecto
vercel
```

Sigue las instrucciones del asistente. Cuando se te pregunte por la configuración:
- Confirma importar la configuración desde vercel.json
- Configura variables de entorno: DATABASE_URL y JWT_SECRET

### 4. Desplegar a producción

```powershell
vercel --prod
```

### 5. Crear la base de datos

Después del primer despliegue, necesitas inicializar la base de datos:

1. Accede a tu cluster de CockroachDB
2. Ejecuta el SQL del archivo `backend/src/db/schema.sql`

Alternativamente, puedes usar el script de deploy:

```powershell
# Verifica que las variables de entorno estén configuradas
cd backend
npx ts-node src/utils/deploy.ts
```

## Actualización del Despliegue

Para actualizaciones futuras:

```powershell
# Hacer commit de los cambios
git add .
git commit -m "Descripción de los cambios"

# Desplegar a Vercel
vercel --prod
```

## Resolución de Problemas

### Error de conexión a la base de datos

- Verifica que la URL de conexión a CockroachDB sea correcta
- Asegúrate de que la IP del servidor de Vercel esté en la lista blanca de CockroachDB

### Errores con las operaciones CRUD

- Verifica la consola del navegador y los logs de Vercel
- Asegúrate de que las tablas se hayan creado correctamente

### Problemas de CORS

- Verifica la configuración de CORS en el backend
- Confirma que las URL del frontend y backend sean correctas en las variables de entorno 