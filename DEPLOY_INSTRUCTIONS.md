# Instrucciones para Publicar el Proyecto con Docker

## Requisitos Previos

1. Docker instalado en la máquina donde se va a publicar
2. Docker Compose instalado
3. Git (opcional, para clonar el repositorio)

## Paso 1: Preparar las Variables de Entorno

1. **Backend**: Verifica que el archivo `backend/.env` contenga todas las variables necesarias:
   - `DATABASE_URL`: La cadena de conexión a CockroachDB
   - `JWT_SECRET`: Clave secreta para tokens JWT (¡cambia esto en producción!)
   - `JWT_EXPIRATION`: Tiempo de expiración de tokens

2. **Frontend**: Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
   ```
   VITE_AWS_REGION=us-east-2
   VITE_AWS_ACCESS_KEY_ID=tu_access_key_id
   VITE_AWS_SECRET_ACCESS_KEY=tu_secret_access_key
   VITE_AWS_BUCKET_NAME=restaurant-items-by-danielxxomg
   ```

## Paso 2: Construir y Ejecutar con Docker Compose

1. Abre PowerShell en la raíz del proyecto (donde está el archivo docker-compose.yml)

2. Crear la carpeta de logs para el backend:
   ```powershell
   New-Item -ItemType Directory -Path logs -Force
   ```

3. Construir las imágenes Docker:
   ```powershell
   docker-compose build
   ```

4. Iniciar los servicios:
   ```powershell
   docker-compose up -d
   ```

5. Verificar que los servicios estén funcionando:
   ```powershell
   docker-compose ps
   ```

6. Ver logs de los servicios (opcional):
   ```powershell
   docker-compose logs -f
   ```

## Paso 3: Acceder a la Aplicación

- Frontend: http://localhost:80
- Backend: http://localhost:3000/api

## Resolución de Problemas

### Si el Frontend no puede conectarse al Backend

1. Verifica que `VITE_API_URL` esté correctamente configurado en el Dockerfile del frontend.
2. Asegúrate de que el backend esté funcionando correctamente usando:
   ```powershell
   docker-compose logs backend
   ```

### Si el Backend no puede conectarse a la Base de Datos

1. Verifica que `DATABASE_URL` en `backend/.env` sea correcta.
2. Comprueba los logs del backend:
   ```powershell
   docker-compose logs backend
   ```

## Comandos Útiles

- Detener todos los servicios:
  ```powershell
  docker-compose down
  ```

- Reiniciar un servicio específico:
  ```powershell
  docker-compose restart backend
  ```

- Ver los logs en tiempo real:
  ```powershell
  docker-compose logs -f
  ```

- Eliminar todos los contenedores y volúmenes:
  ```powershell
  docker-compose down -v
  ```

## Publicación en un Servidor Remoto

1. Copia todos los archivos al servidor remoto
2. Asegúrate de tener Docker y Docker Compose instalados en el servidor
3. Sigue los mismos pasos que para la publicación local
4. Si necesitas exponer los servicios a Internet, configura tu firewall para abrir los puertos 80 y 443

## Seguridad

1. Nunca guardes credenciales en los Dockerfiles
2. Utiliza siempre variables de entorno o archivos `.env` para las credenciales
3. Considera usar Docker Secrets para información sensible en producción
4. Configura HTTPS para el acceso a producción 