from flask import jsonify
from . import main_bp

@main_bp.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "¡Hola desde Flask!"})

@main_bp.route('/api/status', methods=['GET'])
def status():
    """Ruta para comprobar el estado de la API"""
    return jsonify({
        "status": "online",
        "version": "1.0.0",
        "api": "Restaurante API"
    })

@main_bp.route('/', methods=['GET'])
def root():
    """Redirección a /api/hello para evitar 404 en la raíz"""
    return jsonify({"message": "API de Restaurante. Use /api/ para acceder a los endpoints"}) 