# Como ejecutar el proyecto

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+

## 1) Backend (Express)

Desde la raiz del repo:

```bash
cd backend
npm install
npm start
```

Backend disponible en:

- `http://localhost:3000`
- API: `http://localhost:3000/api/productos`

## 2) Frontend (Angular)

En otra terminal, desde la raiz del repo:

```bash
cd frontend
npm install
npm start
```

Frontend disponible en:

- `http://localhost:4200`

## 3) Flujo esperado

- Abrir `http://localhost:4200`
- Ver lista de productos
- Crear producto
- Editar producto
- Eliminar producto

Todo se consume desde el backend en `http://localhost:3000/api/productos`.

## 4) Verificacion rapida (opcional)

Probar backend con curl:

```bash
curl http://localhost:3000/api/productos
```

Build frontend:

```bash
cd frontend
npm run build
```
