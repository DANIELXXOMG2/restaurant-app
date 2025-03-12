const https = require('https');

// URL base del despliegue (se debe actualizar con la URL real después del despliegue)
const BASE_URL = process.argv[2] || 'https://restaurant-app.vercel.app';

console.log(`Probando API en: ${BASE_URL}`);

// Función para hacer una solicitud HTTP
function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = `${BASE_URL}${path}`;
    console.log(`\n\nProbando: ${method} ${url}`);

    const req = https.request(url, options, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`Response body size: ${data.length} bytes`);
        try {
          let parsedData = null;
          if (data) {
            try {
              parsedData = JSON.parse(data);
              console.log(`Respuesta JSON: ${JSON.stringify(parsedData, null, 2)}`);
            } catch (e) {
              console.log(`Respuesta no es JSON. Respuesta plana: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
            }
          } else {
            console.log('Respuesta vacía');
          }
          
          const result = {
            status: res.statusCode,
            headers: res.headers,
            data: parsedData,
            raw: data
          };
          resolve(result);
        } catch (error) {
          console.error('Error al procesar la respuesta:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error en la solicitud:', error);
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// Probar endpoints principales
async function runTests() {
  try {
    // Probar ruta principal
    await makeRequest('/');
    
    // Probar ruta API
    await makeRequest('/api');
    
    // Probar API auth
    await makeRequest('/api/auth');
    
    // Probar API productos
    await makeRequest('/api/productos');
    
    console.log('\n\nPruebas completadas');
  } catch (error) {
    console.error('\n\nError al ejecutar pruebas:', error);
  }
}

runTests(); 