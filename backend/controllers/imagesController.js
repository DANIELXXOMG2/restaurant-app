const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configuración de multer para manejar archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Configurar AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: process.env.VITE_AWS_REGION
});

// Subir imagen a S3
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const fileId = uuidv4();
    const extension = req.file.originalname.split('.').pop();
    const key = `items/${fileId}.${extension}`;

    const params = {
      Bucket: process.env.VITE_AWS_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };

    const uploadResult = await s3.upload(params).promise();

    res.status(200).json({
      url: uploadResult.Location,
      key: uploadResult.Key
    });
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// Eliminar imagen de S3
router.delete('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const params = {
      Bucket: process.env.VITE_AWS_BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();

    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
});

module.exports = router;