# Como ejecutar el proyecto

## Opcion rapida en Windows (sin Node/npm instalados)

- Ejecuta doble clic en `run.bat` desde la raiz del proyecto.
- El script hace esto automaticamente:
  - descarga Node portable si no existe Node/npm en el sistema
  - instala dependencias de `backend/` y `frontend/`
  - levanta backend en `3000` y frontend en `4200`

Requiere internet en la primera ejecucion.

## Opcion manual

### Requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+

### 1) Backend (Express)

Desde la raiz del repo:

```bash
cd backend
npm install
npm start
```

Backend:

- `http://localhost:3000`
- API: `http://localhost:3000/api/productos`

### 2) Frontend (Angular)

En otra terminal:

```bash
cd frontend
npm install
npm start
```

Frontend:

- `http://localhost:4200`

## Flujo funcional esperado

- listar productos
- crear producto
- editar producto
- eliminar producto
