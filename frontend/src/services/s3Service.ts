import { 
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  S3ClientConfig 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuración de AWS
const AWS_CONFIG: S3ClientConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
  }
};

// Agregar logs para depuración
console.log('Cargando variables de entorno S3:');
console.log('- Region:', import.meta.env.VITE_AWS_REGION);
console.log('- Access Key ID:', import.meta.env.VITE_AWS_ACCESS_KEY_ID ? 'Configurado' : 'No configurado');
console.log('- Secret Key:', import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? 'Configurado' : 'No configurado');
console.log('- Bucket:', import.meta.env.VITE_AWS_BUCKET_NAME || 'restaurant-items-by-danielxxomg');

const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME || 'restaurant-items-by-danielxxomg';

// Crear instancia de S3
const s3Client = new S3Client(AWS_CONFIG);

/**
 * Función auxiliar para crear URLs para imágenes S3
 * Esta función genera URLs firmadas para acceso seguro a objetos en S3
 */
export async function getSecureImageUrl(path: string): Promise<string> {
  try {
    // Usar URLs prefirmadas para acceso seguro
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    });
    
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error('Error al generar URL segura:', error);
    // Fallback a URL de marcador de posición
    return 'https://via.placeholder.com/300x200?text=Image+Not+Available';
  }
}

/**
 * Función para convertir rutas S3 a rutas proxy locales
 * Esta solución usa un enfoque basado en backend para evitar problemas de CORS y permisos
 */
export function getImageProxy(path: string): string {
  // Si la ruta ya es una URL completa, extraer solo la parte del Key
  if (path.startsWith('https://')) {
    const bucketPattern = new RegExp(`https://${BUCKET_NAME}\\.s3\\..*\\.amazonaws\\.com/(.+)`);
    const match = path.match(bucketPattern);
    if (match && match[1]) {
      path = match[1];
    } else {
      return path; // Si no podemos extraer la clave, devolver la URL original
    }
  }
  
  // En entorno de desarrollo local, usamos una URL pública con CORS habilitado
  // En lugar de usar placeholder, intentamos acceder directamente con políticas CORS
  const baseUrl = `https://${BUCKET_NAME}.s3.${AWS_CONFIG.region}.amazonaws.com`;
  return `${baseUrl}/${path}`;
  
  // Alternativa: usar una URL de proxy si tienes un backend configurado
  // return `/api/images/${encodeURIComponent(path)}`;
}

/**
 * Sube un archivo a S3
 * @param file Archivo a subir
 * @param folder Carpeta destino en S3 (opcional)
 * @param customFilename Nombre personalizado para el archivo (opcional)
 * @returns Promesa con la URL del archivo subido
 */
export const uploadFile = async (
  file: File,
  folder: string = 'uploads',
  customFilename?: string
): Promise<{ success: boolean; url?: string; key?: string; error?: string }> => {
  try {
    // Preparar nombre de archivo
    let filename = file.name;
    if (customFilename) {
      // Mantener la extensión original
      const extension = filename.split('.').pop();
      filename = `${customFilename}.${extension}`;
    } else {
      // Generar nombre único
      const uniqueId = Math.random().toString(36).substring(2, 10);
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const name = filename.substring(0, filename.lastIndexOf('.'));
      const extension = filename.split('.').pop();
      filename = `${name}_${timestamp}_${uniqueId}.${extension}`;
    }

    // Ruta en S3
    const s3Path = `${folder}/${filename}`;

    // Convertir el archivo a un array de bytes
    const fileContent = await file.arrayBuffer();

    // Crear comando para subir objeto
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Path,
      Body: new Uint8Array(fileContent),
      ContentType: file.type
    });

    // Ejecutar comando
    await s3Client.send(command);
    
    // Generar URL
    const url = `https://${BUCKET_NAME}.s3.${AWS_CONFIG.region}.amazonaws.com/${s3Path}`;
    
    return {
      success: true,
      url,
      key: s3Path
    };
  } catch (error) {
    console.error('Error al subir archivo a S3:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Lista archivos en una carpeta de S3
 * @param folder Carpeta a listar
 * @param maxItems Número máximo de elementos a listar
 * @returns Promesa con la lista de archivos
 */
export const listFiles = async (
  folder: string = 'uploads',
  maxItems: number = 100
): Promise<{ key: string; url: string; size: number; lastModified: Date }[]> => {
  try {
    // Asegurar que el folder termina con '/'
    const folderPath = folder.endsWith('/') ? folder : `${folder}/`;
    
    // Crear comando para listar objetos
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: folderPath,
      MaxKeys: maxItems
    });

    // Ejecutar comando
    const response = await s3Client.send(command);
    
    if (!response.Contents) {
      return [];
    }

    return response.Contents
      .filter(item => item.Key !== folderPath) // Excluir el propio directorio
      .map(item => ({
        key: item.Key!,
        url: `https://${BUCKET_NAME}.s3.${AWS_CONFIG.region}.amazonaws.com/${item.Key}`,
        size: item.Size!,
        lastModified: item.LastModified!
      }));
  } catch (error) {
    console.error('Error al listar archivos de S3:', error);
    return [];
  }
};

/**
 * Elimina un archivo de S3
 * @param fileKey Clave (ruta) del archivo en S3
 * @returns Promesa con el resultado de la operación
 */
export const deleteFile = async (fileKey: string): Promise<boolean> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo de S3:', error);
    return false;
  }
};

/**
 * Genera una URL prefirmada para acceder a un archivo privado
 * @param fileKey Clave (ruta) del archivo en S3
 * @param expiration Tiempo de expiración en segundos
 * @returns URL prefirmada
 */
export const getPresignedUrl = async (
  fileKey: string, 
  expiration: number = 3600
): Promise<string | null> => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: expiration });
    return url;
  } catch (error) {
    console.error('Error al generar URL prefirmada:', error);
    return null;
  }
};

export default {
  uploadFile,
  listFiles,
  deleteFile,
  getPresignedUrl,
  getImageProxy,
  getSecureImageUrl
}; 