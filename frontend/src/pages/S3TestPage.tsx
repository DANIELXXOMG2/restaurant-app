import { useState } from 'react';
import { testS3Connection } from '../utils/s3-tester';
import { Button } from '../components/ui/Button';
import { PageTitle } from '../components/ui/PageTitle';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/icons';

export function S3TestPage() {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testS3Connection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        details: { error }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <PageTitle title="Test de Conexión S3" />
      
      <div className="max-w-3xl mx-auto">
        <Card 
          title="Verificación de Conexión con Amazon S3"
          subtitle="Utiliza esta herramienta para verificar la conexión con el servicio de almacenamiento"
          className="mb-8"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md text-sm">
              <div className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
                <Icons.info className="h-5 w-5 mr-2" />
                Información sobre las credenciales de S3
              </div>
              <div className="mt-2 text-blue-700 dark:text-blue-400">
                <p>Esta herramienta verifica que las siguientes variables de entorno estén configuradas:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>VITE_AWS_REGION</li>
                  <li>VITE_AWS_ACCESS_KEY_ID</li>
                  <li>VITE_AWS_SECRET_ACCESS_KEY</li>
                  <li>VITE_AWS_BUCKET_NAME</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleTestConnection} 
                isLoading={isLoading}
                className="px-6"
              >
                {!isLoading && <Icons.save className="h-5 w-5 mr-2" />}
                Verificar Conexión
              </Button>
            </div>
            
            {testResult && (
              <div className={`mt-6 p-4 rounded-md border ${
                testResult.success 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <div className={`font-medium flex items-center ${
                  testResult.success 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  {testResult.success 
                    ? <Icons.confirm className="h-5 w-5 mr-2" /> 
                    : <Icons.alert className="h-5 w-5 mr-2" />
                  }
                  {testResult.success ? 'Conexión Exitosa' : 'Error de Conexión'}
                </div>
                <p className={`mt-1 ${
                  testResult.success 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  {testResult.message}
                </p>
                
                {testResult.details && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <details>
                      <summary className="font-medium cursor-pointer outline-none">
                        Ver detalles técnicos
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {JSON.stringify(testResult.details, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
        
        <div className="text-center">
          <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400">
            <Icons.chevronLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
} 