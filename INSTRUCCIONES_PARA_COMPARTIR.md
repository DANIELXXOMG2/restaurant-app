# Instrucciones para compartir tu aplicación Restaurant-App

## Opción 1: Publicar en Docker Hub

### Paso 1: Crear una cuenta en Docker Hub
1. Regístrate en [Docker Hub](https://hub.docker.com/)
2. Inicia sesión desde PowerShell:
   ```powershell
   docker login
   ```

### Paso 2: Etiquetar tus imágenes con tu nombre de usuario
```powershell
# Reemplaza 'tunombredeusuario' con tu nombre de usuario de Docker Hub
docker tag restaurantapp/backend:latest danielxxomg2/restaurant-backend:latest
docker tag restaurantapp/frontend:latest danielxxomg2/restaurant-frontend:latest
```

### Paso 3: Publicar las imágenes en Docker Hub
```powershell
docker push danielxxomg2/restaurant-backend:latest
docker push danielxxomg2/restaurant-frontend:latest
```

### Paso 4: Modificar docker-compose.yml para otros usuarios
```yaml
services:
  backend:
    image: tunombredeusuario/restaurant-backend:latest
    # resto de la configuración...
  
  frontend:
    image: tunombredeusuario/restaurant-frontend:latest
    # resto de la configuración...
```

### Paso 5: Compartir el enlace a tus imágenes de Docker Hub
Los usuarios podrán descargar tus imágenes utilizando:
```powershell
docker pull danielxxomg2/restaurant-backend:latest
docker pull danielxxomg2/restaurant-frontend:latest
```

## Opción 2: Exportar las imágenes como archivos

### Paso 1: Guardar las imágenes como archivos .tar
```powershell
docker save -o restaurant-backend.tar restaurantapp/backend:latest
docker save -o restaurant-frontend.tar restaurantapp/frontend:latest
```

### Paso 2: Comprimir los archivos (opcional)
```powershell
Compress-Archive -Path *.tar -DestinationPath restaurant-app-images.zip
```

### Paso 3: Compartir los archivos y el docker-compose.yml
- Sube los archivos a Google Drive, Dropbox o cualquier servicio de almacenamiento
- Incluye instrucciones para cargar las imágenes:
  ```powershell
  docker load -i restaurant-backend.tar
  docker load -i restaurant-frontend.tar
  docker-compose up -d
  ```

## Opción 3: Crear un repositorio en GitHub

### Paso 1: Crear un repositorio en GitHub
- Elimina archivos grandes como node_modules y .env con credenciales

### Paso 2: Incluir instrucciones claras en el README.md
```markdown
# Restaurant-App

## Requisitos
- Docker
- Docker Compose

## Instalación
1. Clona este repositorio
2. Configura el archivo backend/.env con tus credenciales de base de datos
3. Ejecuta `docker-compose up -d`
4. Accede a la aplicación en http://localhost
```

### Paso 3: Proporcionar ejemplos de archivos .env
Crea archivos de ejemplo como `.env.example` sin credenciales reales.

## Consideraciones de seguridad

1. **NUNCA incluyas credenciales reales** en repositorios o imágenes compartidas
2. Utiliza **variables de entorno** para configurar secretos
3. Configura **HTTPS** si vas a desplegar la aplicación en un servidor público
4. Considera usar **volúmenes montados** para datos persistentes

## Soporte para usuarios

Incluye información de contacto o enlace a documentación adicional para que los usuarios puedan resolver problemas comunes. 