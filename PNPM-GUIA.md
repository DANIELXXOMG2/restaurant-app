# Guía de PNPM para el proyecto Restaurant App

## ¿Qué es PNPM?

PNPM (Performant NPM) es un gestor de paquetes alternativo a NPM que ofrece varias ventajas:

- **Ahorro de espacio**: Utiliza un almacén único para todas las dependencias y crea enlaces simbólicos hacia él.
- **Mejor manejo de monorepos**: Facilita la gestión de proyectos con múltiples paquetes (como nuestro caso).
- **Mayor velocidad**: Instalaciones y actualizaciones más rápidas.
- **Estricto en dependencias**: Evita el "dependency hoisting" que puede causar problemas.

## Estructura del proyecto

Este proyecto es un monorepo con la siguiente estructura:

```
restaurant-app/
├── node_modules/          # Dependencias compartidas (mínimas)
├── packages/
│   ├── backend/           # API de Backend con NestJS
│   │   └── node_modules/  # Dependencias específicas del backend
│   └── frontend/          # Frontend con React
│       └── node_modules/  # Dependencias específicas del frontend
├── package.json           # Configuración principal
└── pnpm-workspace.yaml    # Configuración de workspaces
```

## Comandos principales

### Instalación de dependencias

```bash
# Instalar dependencias en todo el proyecto
pnpm install

# Instalar una dependencia en un paquete específico
pnpm --filter @restaurant-app/backend add express
pnpm --filter @restaurant-app/frontend add react-router-dom
```

### Ejecutar scripts

```bash
# Iniciar el desarrollo de todo el proyecto
pnpm dev

# Iniciar solo el backend
pnpm dev:backend

# Iniciar solo el frontend
pnpm dev:frontend

# Construir todo el proyecto
pnpm build
```

### Limpiar caché y dependencias

Para limpiar la caché y reinstalar todas las dependencias:

```bash
# Usando el script de PowerShell
./clean-cache.ps1

# O usando el comando npm
pnpm run clean
```

## Solución de problemas

### Error "Cannot find module"

Si aparece un error indicando que no se puede encontrar un módulo, puede deberse a que:

1. La dependencia no está instalada en el paquete correcto
2. Hay un problema con los enlaces simbólicos

Solución:
```bash
# Reinstalar las dependencias
pnpm install --force
```

### Error "EPERM: operation not permitted"

Este error suele aparecer en Windows cuando un proceso tiene bloqueado un archivo.

Solución:
```bash
# Cerrar todos los procesos de Node.js y luego ejecutar
./clean-cache.ps1
```

## Ventajas de esta configuración

- **Separación clara de dependencias**: Cada proyecto (frontend y backend) tiene sus propias dependencias.
- **Menor tamaño total**: Se evita la duplicación de código.
- **Mayor consistencia**: La configuración de pnpm asegura que cada paquete acceda solo a sus propias dependencias.
- **Gestión centralizada**: Se pueden ejecutar comandos para todo el monorepo desde la raíz. 