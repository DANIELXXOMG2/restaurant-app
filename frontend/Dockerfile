# Etapa de construcción
FROM node:18-slim as build

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Definir argumentos para las variables de entorno (se pasarán durante la construcción)
ARG VITE_API_URL
ARG VITE_AWS_ACCESS_KEY_ID
ARG VITE_AWS_SECRET_ACCESS_KEY
ARG VITE_AWS_REGION
ARG VITE_AWS_BUCKET_NAME

# Establecer variables de entorno para la compilación
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_AWS_ACCESS_KEY_ID=${VITE_AWS_ACCESS_KEY_ID}
ENV VITE_AWS_SECRET_ACCESS_KEY=${VITE_AWS_SECRET_ACCESS_KEY}
ENV VITE_AWS_REGION=${VITE_AWS_REGION}
ENV VITE_AWS_BUCKET_NAME=${VITE_AWS_BUCKET_NAME}

# Compilar aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Añadir script para reemplazar la URL de la API en tiempo de ejecución si es necesario
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
