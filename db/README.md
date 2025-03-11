# Base de Datos - Restaurante App

Este directorio contiene los archivos SQL y utilidades para crear y gestionar la base de datos del sistema de restaurante.

## Estructura de Archivos

- `schema.sql` - Definición del esquema de la base de datos (tablas, relaciones, etc.)
- `test_data.sql` - Datos de prueba para empezar a usar el sistema
- `db_utils.py` - Script de Python con utilidades para inicializar la base de datos

## Descripción del Esquema

El esquema SQL incluye las siguientes tablas principales:

1. **Usuarios** - Almacena información sobre clientes y administradores
2. **Categorías** - Categorías de platos (hamburguesas, pizzas, bebidas, etc.)
3. **Platos** - Productos del menú del restaurante
4. **Pedidos** - Registros de pedidos realizados
5. **Detalles de Pedido** - Elementos individuales de cada pedido

Esta es una versión simplificada que contiene solo las tablas esenciales para el funcionamiento básico del sistema de restaurante.

## Uso de las Utilidades

Para inicializar la base de datos:

```bash
# Instalar dependencias
pip install psycopg2-binary python-dotenv

# Ejecutar script de inicialización
python db_utils.py
```

El script verificará si las tablas ya existen y, si no, creará el esquema y añadirá los datos de prueba.

## Conexión a la Base de Datos

Este proyecto utiliza CockroachDB en la nube. La cadena de conexión debe configurarse como variable de entorno `DATABASE_URL` en un archivo `.env` en la raíz del proyecto:

```
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/basedatos?sslmode=verify-full"
```

## Notas Importantes

1. **Seguridad**: Las contraseñas en `test_data.sql` están hasheadas (formato bcrypt).
2. **Actualizaciones**: Para actualizar el esquema, cree un archivo de migración separado y ejecútelo manualmente.
3. **Respaldos**: Se recomienda hacer respaldos regulares de la base de datos en producción.

## Extensión y Personalización

Si necesita modificar el esquema para adaptarlo a nuevos requisitos:

1. Modifique el archivo `schema.sql`
2. Actualice `test_data.sql` si es necesario
3. Ejecute manualmente los cambios en su instancia de base de datos o utilice la utilidad de inicialización para una nueva instalación

## Consultas Comunes

Algunas consultas útiles para trabajar con este esquema:

```sql
-- Obtener todos los platos de una categoría
SELECT * FROM platos WHERE categoria_id = X;

-- Obtener el menú completo con sus categorías
SELECT p.*, c.nombre as categoria 
FROM platos p 
JOIN categorias c ON p.categoria_id = c.id 
WHERE p.disponible = TRUE;

-- Ver los pedidos de un cliente específico
SELECT * FROM pedidos WHERE usuario_id = X ORDER BY fecha_pedido DESC;

-- Ver detalles de un pedido específico
SELECT dp.cantidad, p.nombre, dp.precio_unitario, dp.subtotal 
FROM detalles_pedido dp 
JOIN platos p ON dp.plato_id = p.id 
WHERE dp.pedido_id = X;
``` 