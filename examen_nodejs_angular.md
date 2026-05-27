# Examen Node.js + Angular 19+ CRUD

## EVALUACIÓN PRÁCTICA

### Servicio Node.js + Proyecto Angular 19+
#### Operaciones CRUD — Gestión de Productos

**Mg. Anthony Paul Tavara Ramos**  
**JavaScript Avanzado (100000SI56)**  
**Unidad 2: Angular**

- Duración: 90 minutos
- Puntaje total: 20 puntos
- Evaluación individual

---

# Instrucciones generales

- El examen es individual.
- Entrega dos carpetas: `backend/` y `frontend/`.
- Comprime ambas en un ZIP llamado:

```txt
U[codigo]_Examen_P2.zip
```

- Backend en puerto `3000`
- Frontend Angular en puerto `4200`
- Backend solo puede usar:
  - Express
  - cors
- Angular debe usar:
  - standalone components
  - Signals
  - HttpClient
  - Reactive Forms

---

# Escenario — Gestión de Productos

Cada producto tendrá:

| Campo | Tipo |
|---|---|
| id | number |
| nombre | string |
| categoria | string |
| precio | number |
| stock | number |
| activo | boolean |

---

# PARTE 1 — Backend Node.js (8 pts)

## 1.1 Inicialización (2 pts)

### a) npm + dependencias (0.5 pts)

Instalar:

```bash
npm init -y
npm install express cors
```

### b) Archivo data.js (1 pt)

Crear array con mínimo 3 productos.

### c) Servidor Express (0.5 pts)

- Puerto 3000
- Mensaje en consola
- Sin errores

---

## 1.2 CRUD API REST (6 pts)

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/productos` | Listar |
| GET | `/api/productos/:id` | Obtener por id |
| POST | `/api/productos` | Crear |
| PUT | `/api/productos/:id` | Actualizar |
| DELETE | `/api/productos/:id` | Eliminar |

### Estados HTTP

- 200 OK
- 201 Created
- 404 Not Found

---

# PARTE 2 — Angular 19+ (10 pts)

## 2.1 Modelo Producto (1 pt)

```ts
export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  activo: boolean;
}
```

---

## 2.2 ProductoService (3 pts)

Debe usar:

- HttpClient
- Signals
- asReadonly()

### Métodos

- listar()
- obtener(id)
- crear(producto)
- actualizar(id, producto)
- eliminar(id)

Agregar en `app.config.ts`:

```ts
provideHttpClient()
```

---

## 2.3 Componente Lista (3 pts)

Debe:

- cargar productos al iniciar
- usar `@for`
- botón Eliminar
- botón Editar
- botón Nuevo Producto

---

## 2.4 Componente Formulario (3 pts)

Debe soportar:

- crear
- editar

### Validaciones

- nombre: requerido + min 2
- categoria: requerido + min 2
- precio: min 0
- stock: min 0

### Navegación

- guardar → `/lista`
- cancelar → `/lista`

---

## 2.5 Rutas

```ts
''
→ /lista
```

```ts
/lista
```

```ts
/formulario/:id
```

```ts
**
→ /lista
```

---

# PARTE 3 — Integración (2 pts)

Evaluación:

- listar
- crear
- editar
- eliminar

Todo debe funcionar sin recargar la página.

---

# ENTREGA FINAL

Comprimir:

```txt
backend/
frontend/
```

En:

```txt
U[codigo]_Examen_P2.zip
```
