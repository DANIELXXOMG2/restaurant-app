import React, { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';
import { listFiles, deleteFile } from '../services/s3Service';

const ImageUploadDemo: React.FC = () => {
  const [images, setImages] = useState<{ key: string; url: string; size: number }[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('platos');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const folders = ['categorias', 'platos', 'usuarios', 'uploads'];

  useEffect(() => {
    loadImages();
  }, [selectedFolder]);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const filesList = await listFiles(selectedFolder);
      setImages(filesList);
    } catch (error) {
      setErrorMessage('Error al cargar imágenes');
      console.error('Error al cargar imágenes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (url: string, key: string) => {
    setSuccessMessage(`Imagen subida exitosamente: ${url} (${key})`);
    // Actualizar la lista de imágenes
    loadImages();
    
    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleUploadError = (error: string) => {
    setErrorMessage(`Error al subir imagen: ${error}`);
    
    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleDeleteImage = async (key: string) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta imagen?');
    if (!confirmDelete) return;

    try {
      const success = await deleteFile(key);
      if (success) {
        setSuccessMessage(`Imagen eliminada exitosamente: ${key}`);
        // Actualizar la lista de imágenes
        loadImages();
      } else {
        setErrorMessage(`No se pudo eliminar la imagen: ${key}`);
      }
    } catch (error) {
      setErrorMessage('Error al eliminar imagen');
      console.error('Error al eliminar imagen:', error);
    }
    
    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 5000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Demo de Carga de Imágenes a S3</h1>
      
      {/* Mensajes de éxito/error */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {errorMessage}
        </div>
      )}
      
      {/* Selector de carpeta */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Carpeta:
        </label>
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-64"
        >
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
        </select>
      </div>
      
      {/* Componente para subir imágenes */}
      <div className="mb-8 p-4 border border-gray-200 rounded">
        <h2 className="text-xl font-semibold mb-4">Subir Nueva Imagen</h2>
        <ImageUploader
          folder={selectedFolder}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          buttonText="Seleccionar Imagen"
        />
      </div>
      
      {/* Lista de imágenes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Imágenes en la carpeta "{selectedFolder}"
        </h2>
        
        {isLoading ? (
          <p>Cargando imágenes...</p>
        ) : images.length === 0 ? (
          <p>No hay imágenes en esta carpeta.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.key}
                className="border border-gray-200 rounded overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={image.key}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm truncate mb-1">{image.key}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {Math.round(image.size / 1024)} KB
                  </p>
                  <button
                    onClick={() => handleDeleteImage(image.key)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadDemo; 