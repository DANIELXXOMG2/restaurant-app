from flask import jsonify
from app.routes import main_bp

@main_bp.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "¡Hola desde Flask!"}) 