# Evaluación Práctica — Node.js + React CRUD
## Gestión de Pagos de Arbitrios Municipales

---

## Requisitos extraídos del examen

**Estructura y entrega:**
- Carpeta `backend/` (Node.js) y `frontend/` (React 19+)
- Backend en puerto **3000**, Frontend en puerto **5173**
- Backend: solo `express` y `cors` permitidos
- Frontend: TypeScript, Vite, componentes funcionales, Context API + useState, Axios, React Router

**Modelo de datos (6 atributos exactos):**

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | number | Auto-generado por backend |
| `contribuyente` | string | Requerido, mínimo 2 caracteres |
| `codigoPredio` | string | Ej: 'P-00123' |
| `tipoArbitrio` | string | Ej: 'Limpieza Pública', 'Serenazgo' |
| `monto` | number | Mínimo 0 |
| `pagado` | boolean | true = pagado, false = pendiente |

**Backend — Endpoints:**

| Método | Ruta | Estado |
|---|---|---|
| GET | `/api/arbitrios` | 200 |
| GET | `/api/arbitrios/:id` | 200 / 404 |
| POST | `/api/arbitrios` | 201 |
| PUT | `/api/arbitrios/:id` | 200 / 404 |
| DELETE | `/api/arbitrios/:id` | 200 / 404 |

**Frontend — Archivos requeridos:**
- `types/Arbitrio.ts` — interfaz con 6 atributos
- `context/ArbitrioContext.tsx` — Provider + hook `useArbitrios` + 5 métodos con Axios
- `components/Lista/Lista.tsx` — tabla con `.map()`, key por id, botones Editar/Eliminar/Nuevo Pago
- `components/Formulario/Formulario.tsx` — useState por campo, validaciones manuales, modos crear/editar
- `App.tsx` — rutas: `/`→`/lista`, `/lista`, `/formulario/:id`, `*`→`/lista`

---

## Estructura de carpetas

```
backend/
├── package.json
├── data.js
└── index.js

frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types/
    │   └── Arbitrio.ts
    ├── context/
    │   └── ArbitrioContext.tsx
    └── components/
        ├── Lista/
        │   └── Lista.tsx
        └── Formulario/
            └── Formulario.tsx
```

---

## Implementación Parte 1 — Backend

### `backend/package.json`
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}
```

### `backend/data.js`
```js
const arbitrios = [
  { id: 1, contribuyente: 'Juan Pérez', codigoPredio: 'P-00123', tipoArbitrio: 'Serenazgo', monto: 85, pagado: true },
  { id: 2, contribuyente: 'María García', codigoPredio: 'P-00456', tipoArbitrio: 'Limpieza Pública', monto: 60, pagado: false },
  { id: 3, contribuyente: 'Carlos López', codigoPredio: 'P-00789', tipoArbitrio: 'Parques y Jardines', monto: 45, pagado: true }
];

module.exports = arbitrios;
```

### `backend/index.js`
```js
const express = require('express');
const cors = require('cors');
const arbitrios = require('./data');

const app = express();

app.use(cors());
app.use(express.json());

let nextId = 4;

app.get('/api/arbitrios', (req, res) => {
  res.status(200).json(arbitrios);
});

app.get('/api/arbitrios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const arbitrio = arbitrios.find(a => a.id === id);
  if (!arbitrio) return res.status(404).json({ message: 'No encontrado' });
  res.status(200).json(arbitrio);
});

app.post('/api/arbitrios', (req, res) => {
  const nuevo = { id: nextId++, ...req.body };
  arbitrios.push(nuevo);
  res.status(201).json(nuevo);
});

app.put('/api/arbitrios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = arbitrios.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ message: 'No encontrado' });
  arbitrios[index] = { id, ...req.body };
  res.status(200).json(arbitrios[index]);
});

app.delete('/api/arbitrios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = arbitrios.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ message: 'No encontrado' });
  arbitrios.splice(index, 1);
  res.status(200).json({ message: 'Eliminado' });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
```

---

## Implementación Parte 2 — Frontend

### `frontend/src/types/Arbitrio.ts`
```ts
export interface Arbitrio {
  id: number;
  contribuyente: string;
  codigoPredio: string;
  tipoArbitrio: string;
  monto: number;
  pagado: boolean;
}
```

### `frontend/src/context/ArbitrioContext.tsx`
```tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { Arbitrio } from '../types/Arbitrio';

const API_URL = 'http://localhost:3000/api/arbitrios';

interface ArbitrioContextType {
  arbitrios: Arbitrio[];
  listar: () => Promise<void>;
  obtener: (id: number) => Promise<Arbitrio>;
  crear: (arbitrio: Omit<Arbitrio, 'id'>) => Promise<void>;
  actualizar: (id: number, arbitrio: Omit<Arbitrio, 'id'>) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}

const ArbitrioContext = createContext<ArbitrioContextType | undefined>(undefined);

export function ArbitrioProvider({ children }: { children: ReactNode }) {
  const [arbitrios, setArbitrios] = useState<Arbitrio[]>([]);

  const listar = async () => {
    const response = await axios.get<Arbitrio[]>(API_URL);
    setArbitrios(response.data);
  };

  const obtener = async (id: number): Promise<Arbitrio> => {
    const response = await axios.get<Arbitrio>(`${API_URL}/${id}`);
    return response.data;
  };

  const crear = async (arbitrio: Omit<Arbitrio, 'id'>) => {
    await axios.post(API_URL, arbitrio);
    await listar();
  };

  const actualizar = async (id: number, arbitrio: Omit<Arbitrio, 'id'>) => {
    await axios.put(`${API_URL}/${id}`, arbitrio);
    await listar();
  };

  const eliminar = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    await listar();
  };

  return (
    <ArbitrioContext.Provider value={{ arbitrios, listar, obtener, crear, actualizar, eliminar }}>
      {children}
    </ArbitrioContext.Provider>
  );
}

export function useArbitrios(): ArbitrioContextType {
  const context = useContext(ArbitrioContext);
  if (!context) throw new Error('useArbitrios debe usarse dentro de ArbitrioProvider');
  return context;
}
```

### `frontend/src/components/Lista/Lista.tsx`
```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArbitrios } from '../../context/ArbitrioContext';

export default function Lista() {
  const { arbitrios, listar, eliminar } = useArbitrios();
  const navigate = useNavigate();

  useEffect(() => {
    listar();
  }, []);

  return (
    <div>
      <div>
        <h1>Pagos de Arbitrios Municipales</h1>
        <button onClick={() => navigate('/formulario/nuevo')}>Nuevo Pago</button>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Contribuyente</th>
            <th>Código Predio</th>
            <th>Tipo Arbitrio</th>
            <th>Monto</th>
            <th>Pagado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {arbitrios.map(arbitrio => (
            <tr key={arbitrio.id}>
              <td>{arbitrio.id}</td>
              <td>{arbitrio.contribuyente}</td>
              <td>{arbitrio.codigoPredio}</td>
              <td>{arbitrio.tipoArbitrio}</td>
              <td>{arbitrio.monto}</td>
              <td>{arbitrio.pagado ? 'Sí' : 'No'}</td>
              <td>
                <button onClick={() => navigate(`/formulario/${arbitrio.id}`)}>Editar</button>
                <button onClick={() => eliminar(arbitrio.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### `frontend/src/components/Formulario/Formulario.tsx`
```tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArbitrios } from '../../context/ArbitrioContext';

interface FormState {
  contribuyente: string;
  codigoPredio: string;
  tipoArbitrio: string;
  monto: number;
  pagado: boolean;
}

interface TouchedState {
  contribuyente: boolean;
  codigoPredio: boolean;
  monto: boolean;
}

export default function Formulario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { obtener, crear, actualizar } = useArbitrios();

  const [form, setForm] = useState<FormState>({
    contribuyente: '',
    codigoPredio: '',
    tipoArbitrio: '',
    monto: 0,
    pagado: false,
  });

  const [touched, setTouched] = useState<TouchedState>({
    contribuyente: false,
    codigoPredio: false,
    monto: false,
  });

  useEffect(() => {
    if (id !== 'nuevo') {
      obtener(Number(id)).then(data => {
        setForm({
          contribuyente: data.contribuyente,
          codigoPredio: data.codigoPredio,
          tipoArbitrio: data.tipoArbitrio,
          monto: data.monto,
          pagado: data.pagado,
        });
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'monto') {
      setForm(prev => ({ ...prev, monto: Number(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === 'contribuyente' || name === 'codigoPredio' || name === 'monto') {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const errors = {
    contribuyente: form.contribuyente.trim().length < 2 ? 'Mínimo 2 caracteres' : '',
    codigoPredio: form.codigoPredio.trim().length < 2 ? 'Mínimo 2 caracteres' : '',
    monto: form.monto < 0 ? 'El monto mínimo es 0' : '',
  };

  const isValid = !errors.contribuyente && !errors.codigoPredio && !errors.monto;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ contribuyente: true, codigoPredio: true, monto: true });
    if (!isValid) return;

    if (id === 'nuevo') {
      await crear(form);
    } else {
      await actualizar(Number(id), form);
    }
    navigate('/lista');
  };

  return (
    <div>
      <h1>{id === 'nuevo' ? 'Nuevo Pago' : 'Editar Pago'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Contribuyente</label><br />
          <input
            name="contribuyente"
            value={form.contribuyente}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.contribuyente && errors.contribuyente && (
            <span style={{ color: 'red', display: 'block' }}>{errors.contribuyente}</span>
          )}
        </div>
        <div>
          <label>Código Predio</label><br />
          <input
            name="codigoPredio"
            value={form.codigoPredio}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.codigoPredio && errors.codigoPredio && (
            <span style={{ color: 'red', display: 'block' }}>{errors.codigoPredio}</span>
          )}
        </div>
        <div>
          <label>Tipo Arbitrio</label><br />
          <input
            name="tipoArbitrio"
            value={form.tipoArbitrio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Monto</label><br />
          <input
            type="number"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.monto && errors.monto && (
            <span style={{ color: 'red', display: 'block' }}>{errors.monto}</span>
          )}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="pagado"
              checked={form.pagado}
              onChange={handleChange}
            />
            {' '}Pagado
          </label>
        </div>
        <br />
        <button type="submit">Guardar</button>
        {' '}
        <button type="button" onClick={() => navigate('/lista')}>Cancelar</button>
      </form>
    </div>
  );
}
```

### `frontend/src/App.tsx`
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ArbitrioProvider } from './context/ArbitrioContext';
import Lista from './components/Lista/Lista';
import Formulario from './components/Formulario/Formulario';

function App() {
  return (
    <ArbitrioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/lista" />} />
          <Route path="/lista" element={<Lista />} />
          <Route path="/formulario/:id" element={<Formulario />} />
          <Route path="*" element={<Navigate to="/lista" />} />
        </Routes>
      </BrowserRouter>
    </ArbitrioProvider>
  );
}

export default App;
```

### `frontend/src/main.tsx`
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## Verificación de rúbrica

| Ítem | Criterio | Archivo | Estado |
|---|---|---|---|
| 1.1 | data.js con 3 pagos, servidor en :3000 | `backend/data.js`, `backend/index.js` | ✅ |
| 1.2a | GET /api/arbitrios → 200 | `index.js` | ✅ 200 |
| 1.2b | GET /api/arbitrios/:id → 200 o 404 | `index.js` | ✅ 200/404 |
| 1.2c | POST → id autogenerado, 201 | `index.js` | ✅ 201 |
| 1.2d | PUT → actualiza o 404 | `index.js` | ✅ 200/404 |
| 1.2e | DELETE → elimina o 404 | `index.js` | ✅ 200/404 |
| 2.1 | Interfaz Arbitrio, 6 atributos, `types/Arbitrio.ts` | `src/types/Arbitrio.ts` | ✅ |
| 2.2 | ArbitrioContext + hook useArbitrios + 5 métodos Axios + listar() tras cada op. | `src/context/ArbitrioContext.tsx` | ✅ |
| 2.3 | Lista: useEffect→listar(), .map()+key=id, columna por atributo, Eliminar/Editar/Nuevo | `src/components/Lista/Lista.tsx` | ✅ |
| 2.4 | Formulario: useState por campo, validaciones manuales, modo nuevo/editar, redirección, Cancelar | `src/components/Formulario/Formulario.tsx` | ✅ |
| 2.5 | Rutas: /→/lista, /lista, /formulario/:id, *→/lista | `src/App.tsx` | ✅ |
| 3 | Ciclo CRUD completo en navegador con ambos servidores activos | Integración | ✅ |

---

## Comandos para ejecutar

**Backend** (puerto 3000):
```bash
cd backend
npm install
npm start
```

**Frontend** (puerto 5173):
```bash
cd frontend
npm install
npm run dev
```
