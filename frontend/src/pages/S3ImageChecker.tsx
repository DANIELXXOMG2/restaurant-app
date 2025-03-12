import { useState, useEffect } from 'react';
import { listFiles } from '../services/s3Service';
import { PageTitle } from '../components/ui/PageTitle';

interface S3File {
  key: string;
  url: string;
  size: number;
  lastModified: Date;
}

export function S3ImageChecker() {
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState<S3File[]>([]);
  const [platos, setPlatos] = useState<S3File[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        
        // Buscar imágenes de categorías
        const categoriasFiles = await listFiles('categorias');
        setCategorias(categoriasFiles);
        
        // Buscar imágenes de platos
        const platosFiles = await listFiles('platos');
        setPlatos(platosFiles);
        
      } catch (err) {
        setError('Error al cargar imágenes de S3: ' + (err instanceof Error ? err.message : String(err)));
        console.error('Error al cargar imágenes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <PageTitle title="Verificador de Imágenes S3" />
      
      {isLoading && (
        <div className="text-center py-10">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-400 border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Cargando imágenes desde S3...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-300 p-4 rounded-lg mb-8">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!isLoading && !error && (
        <>
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Imágenes de Categorías</h2>
            {categorias.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No se encontraron imágenes en la carpeta "categorias".</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map((file) => (
                  <div key={file.key} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={file.url} 
                      alt={file.key.split('/').pop() || ''} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x200?text=Error+de+carga';
                      }}
                    />
                    <div className="p-4">
                      <p className="text-gray-800 dark:text-gray-200 font-medium truncate">{file.key.split('/').pop()}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Ruta: {file.key}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Tamaño: {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Imágenes de Platos</h2>
            {platos.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No se encontraron imágenes en la carpeta "platos".</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platos.map((file) => (
                  <div key={file.key} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={file.url} 
                      alt={file.key.split('/').pop() || ''} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x200?text=Error+de+carga';
                      }}
                    />
                    <div className="p-4">
                      <p className="text-gray-800 dark:text-gray-200 font-medium truncate">{file.key.split('/').pop()}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Ruta: {file.key}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Tamaño: {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 