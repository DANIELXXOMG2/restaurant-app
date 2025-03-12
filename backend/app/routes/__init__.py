from flask import Blueprint

main_bp = Blueprint('main', __name__)

from . import views
from .images_routes import images_bp 