from backend.app import create_app
from flask import Flask, request

app = create_app()

# Handler para funciones serverless de Vercel
def handler(request):
    """
    Punto de entrada para Vercel Serverless Functions.
    Esta función es requerida por Vercel para manejar las solicitudes HTTP.
    """
    return app(request.environ, start_response)

def start_response(status, response_headers, exc_info=None):
    """
    Función de ayuda para procesar las respuestas HTTP.
    """
    return [status, response_headers]

# Exponemos la variable 'handler' directamente como requiere Vercel
handler = app

# Para pruebas locales
if __name__ == "__main__":
    app.run(debug=True) 