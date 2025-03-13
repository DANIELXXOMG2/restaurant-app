import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

// Configuración de AWS
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-2';
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '';
const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME || 'restaurant-items-by-danielxxomg';

// Función para verificar la conexión con S3
export async function testS3Connection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('Iniciando prueba de conexión con S3...');
    console.log('Credenciales cargadas:');
    console.log('- Región:', AWS_REGION);
    console.log('- Access Key ID:', AWS_ACCESS_KEY_ID ? 'Configurado' : 'No configurado');
    console.log('- Secret Key:', AWS_SECRET_ACCESS_KEY ? 'Configurado' : 'No configurado');
    console.log('- Bucket:', BUCKET_NAME);

    // Verificar si las credenciales están configuradas
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      return {
        success: false,
        message: 'Faltan credenciales de AWS. Verifica las variables de entorno.',
        details: {
          region: AWS_REGION,
          accessKeyConfigured: !!AWS_ACCESS_KEY_ID,
          secretKeyConfigured: !!AWS_SECRET_ACCESS_KEY,
          bucket: BUCKET_NAME
        }
      };
    }

    // Crear cliente S3
    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    // Intentar listar los buckets para verificar la conexión
    console.log('Intentando listar buckets S3...');
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);

    // Verificar si el bucket especificado existe
    const bucketExists = response.Buckets?.some(bucket => bucket.Name === BUCKET_NAME);

    if (!bucketExists) {
      return {
        success: false,
        message: `Conexión establecida pero el bucket '${BUCKET_NAME}' no existe.`,
        details: {
          buckets: response.Buckets?.map(b => b.Name),
          totalBuckets: response.Buckets?.length
        }
      };
    }

    return {
      success: true,
      message: 'Conexión a S3 establecida correctamente y bucket encontrado.',
      details: {
        bucket: BUCKET_NAME,
        region: AWS_REGION,
        totalBuckets: response.Buckets?.length
      }
    };
  } catch (error) {
    console.error('Error al conectar con S3:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al conectar con S3',
      details: { error }
    };
  }
} 