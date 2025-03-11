"""
Utilidades para base de datos - Implementar:
1. Conectar a CockroachDB (DATABASE_URL en .env)
2. Ejecutar archivos schema.sql y test_data.sql
3. Inicializar tablas y datos de prueba
4. Verificar si las tablas ya existen
"""
import os, psycopg2
from dotenv import load_dotenv
