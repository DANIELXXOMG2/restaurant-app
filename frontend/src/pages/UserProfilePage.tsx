import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { PageTitle } from '../components/ui/PageTitle';
import { Icons } from '../components/icons';
import { uploadFile } from '../services/s3Service';
import toast from 'react-hot-toast';
import axios from 'axios';

export function UserProfilePage() {
  const { user, token, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    // Actualizar la imagen de vista previa cuando se selecciona un archivo
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageTitle title="Perfil de Usuario" />
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Acceso Restringido</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Debes iniciar sesión para ver esta página.</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpdateProfilePhoto = async () => {
    if (!selectedFile || !user || !token) {
      toast.error('Selecciona una imagen para actualizar tu perfil');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Subir el archivo a S3 en la carpeta 'usuarios/{id_usuario}'
      const folderPath = `usuarios/${user.id}`;
      const fileUploadResult = await uploadFile(selectedFile, folderPath);

      if (!fileUploadResult.success) {
        throw new Error(fileUploadResult.error || 'Error al subir la imagen');
      }

      // 2. Actualizar la URL del usuario en la base de datos
      await axios.put(
        `${API_URL}/usuarios/${user.id}/foto`, 
        { imagen_url: fileUploadResult.url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Actualizar el contexto del usuario
      setUser({
        ...user,
        imagen_url: fileUploadResult.url
      });

      toast.success('Foto de perfil actualizada correctamente');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error al actualizar foto de perfil:', error);
      toast.error('Error al actualizar la foto de perfil. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Perfil de Usuario" />
      
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
            Mi Perfil
          </h1>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Foto de perfil */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
                {(previewUrl || user.imagen_url) ? (
                  <img 
                    src={previewUrl || user.imagen_url} 
                    alt={user.nombre} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Icons.user className="w-20 h-20" />
                  </div>
                )}
              </div>
              
              <label className="mb-2 text-gray-900 dark:text-gray-100">
                <span className="block text-sm font-medium mb-1">Cambiar foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center"
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }}
                >
                  <Icons.upload className="h-4 w-4 mr-2" />
                  Seleccionar imagen
                </Button>
              </label>
              
              {selectedFile && (
                <div className="mt-2 flex gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[140px]">
                    {selectedFile.name}
                  </span>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Icons.close className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <Button
                className="w-full mt-4"
                disabled={!selectedFile || isLoading}
                onClick={handleUpdateProfilePhoto}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar foto'}
              </Button>
            </div>
            
            {/* Información del usuario */}
            <div className="w-full md:w-2/3 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Información Personal
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</span>
                    <span className="block text-lg text-gray-900 dark:text-gray-100">{user.nombre}</span>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Correo electrónico</span>
                    <span className="block text-lg text-gray-900 dark:text-gray-100">{user.email}</span>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de cuenta</span>
                    <span className="block text-lg text-gray-900 dark:text-gray-100 capitalize">{user.rol}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 