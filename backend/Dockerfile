# Etapa de construcción
FROM node:18-slim AS build

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build

# Eliminar dependencias de desarrollo
RUN npm prune --production

# Etapa de producción
FROM node:18-slim

# Directorio de trabajo
WORKDIR /app

# Copiar archivos compilados y dependencias de producción
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Exponer puerto
EXPOSE 3000

# Variables de entorno serán proporcionadas en tiempo de ejecución
# a través de docker-compose o docker run --env-file

# Iniciar aplicación
CMD ["node", "dist/index.js"]
