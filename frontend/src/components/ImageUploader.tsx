import React, { useState, useRef } from 'react';
import { uploadFile } from '../services/s3Service';

interface ImageUploaderProps {
  id?: string;
  folder?: string;
  onUploadSuccess?: (url: string, key: string) => void;
  onUploadError?: (error: string) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
  buttonText?: string;
  loadingText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  folder = 'uploads',
  onUploadSuccess,
  onUploadError,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeMB = 5,
  className = '',
  buttonText = 'Seleccionar imagen',
  loadingText = 'Subiendo...',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      onUploadError?.(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validar tamaño de archivo
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onUploadError?.(`El archivo es demasiado grande. El tamaño máximo permitido es ${maxSizeMB}MB`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Mostrar vista previa
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progreso (AWS SDK no proporciona progreso real en la versión actual)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

      const result = await uploadFile(file, folder);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success && result.url && result.key) {
        onUploadSuccess?.(result.url, result.key);
      } else {
        onUploadError?.(result.error || 'Error desconocido al subir la imagen');
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsUploading(false);
      // No limpiamos el input para que el usuario pueda ver qué archivo seleccionó
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-uploader ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedTypes.join(',')}
        className="hidden"
        disabled={isUploading}
      />
      
      <button
        id={id}
        type="button"
        onClick={triggerFileInput}
        disabled={isUploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isUploading ? loadingText : buttonText}
      </button>
      
      {isUploading && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {previewUrl && (
        <div className="mt-4">
          <img 
            src={previewUrl} 
            alt="Vista previa" 
            className="max-w-xs rounded border border-gray-300" 
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 