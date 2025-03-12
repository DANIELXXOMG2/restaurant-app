const https = require('https');

// URL base del despliegue (se debe actualizar con la URL real después del despliegue)
const BASE_URL = process.argv[2] || 'https://restaurant-app-vercel.vercel.app';

console.log(`Probando API en: ${BASE_URL}`);

// Función para hacer una solicitud HTTP
function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = `${BASE_URL}${path}`;
    console.log(`Probando: ${method} ${url}`);

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            data: data ? JSON.parse(data) : null
          };
          console.log(`Respuesta: ${res.statusCode}`);
          console.log(JSON.stringify(result.data, null, 2));
          resolve(result);
        } catch (error) {
          console.error('Error al analizar la respuesta:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error en la solicitud:', error);
      reject(error);
    });

    req.end();
  });
}

// Probar endpoints principales
async function runTests() {
  try {
    // Probar ruta principal
    await makeRequest('/');
    
    // Probar API auth
    await makeRequest('/api/auth');
    
    // Probar API productos
    await makeRequest('/api/productos');
    
    console.log('Pruebas completadas');
  } catch (error) {
    console.error('Error al ejecutar pruebas:', error);
  }
}

runTests(); 