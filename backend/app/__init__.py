from flask import Flask
from flask_cors import CORS
import os
import sys

# Añadir el directorio raíz al PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def create_app():
    app = Flask(__name__)
    CORS(app)  # Habilitar CORS para todas las rutas
    
    # Importar y registrar blueprints
    from .routes import main_bp
    from .routes.images_routes import images_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(images_bp)
    
    return app 