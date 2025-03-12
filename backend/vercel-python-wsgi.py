from app import create_app
import os
import sys

# Asegurarse de que el directorio raíz del proyecto esté en sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Crear la aplicación Flask
app = create_app()

# Handler para Vercel Serverless Functions
def handler(request, context):
    """
    Punto de entrada para Vercel Serverless Functions.
    Esta función es requerida por Vercel para manejar las solicitudes HTTP.
    """
    # Configurar CORS para todas las rutas en Vercel
    if 'headers' not in request:
        request['headers'] = {}
    
    # Configurar la respuesta para CORS
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    
    # Manejar las solicitudes OPTIONS para CORS preflight
    if request.get('method', '') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    # Procesar la solicitud con la aplicación Flask
    try:
        # Crear un entorno WSGI para Flask a partir del evento de Vercel
        environ = {
            'REQUEST_METHOD': request.get('method', 'GET'),
            'PATH_INFO': request.get('path', '/'),
            'QUERY_STRING': request.get('query', ''),
            'CONTENT_TYPE': request.get('headers', {}).get('content-type', ''),
            'CONTENT_LENGTH': str(len(request.get('body', ''))),
            'HTTP': 'on',
            'SERVER_NAME': 'vercel',
            'SERVER_PORT': '443',
            'HTTPS': 'on',
            'wsgi.url_scheme': 'https',
            'wsgi.input': request.get('body', ''),
            'wsgi.errors': sys.stderr,
        }
        
        # Manejar la respuesta de Flask
        status_code = 200
        response_headers = []
        response_body = ""
        
        def start_response(status, headers):
            nonlocal status_code, response_headers
            status_code = int(status.split()[0])
            response_headers = headers
        
        # Ejecutar la aplicación Flask
        response_body = app(environ, start_response)
        
        # Convertir la respuesta de Flask al formato esperado por Vercel
        body = b''.join(response_body).decode('utf-8')
        
        # Construir encabezados para la respuesta
        header_dict = dict(response_headers)
        header_dict.update(headers)  # Añadir encabezados CORS
        
        return {
            'statusCode': status_code,
            'headers': header_dict,
            'body': body
        }
    
    except Exception as e:
        # Manejar cualquier error
        return {
            'statusCode': 500,
            'headers': headers,
            'body': f"Error en el servidor: {str(e)}"
        } 