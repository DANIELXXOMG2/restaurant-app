from app import create_app

app = create_app()

# Handler para funciones serverless de Vercel
def handler(request, **kwargs):
    """
    Punto de entrada para Vercel Serverless Functions.
    Esta función es requerida por Vercel para manejar las solicitudes HTTP.
    """
    return app(request.environ, lambda status, headers, exc_info: [])

# Para pruebas locales
if __name__ == "__main__":
    app.run(debug=True) 