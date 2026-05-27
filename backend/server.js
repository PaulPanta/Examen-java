const express = require('express');
const cors = require('cors');
const productos = require('./data');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/productos', (_req, res) => {
  res.status(200).json(productos);
});

app.get('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((item) => item.id === id);

  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.status(200).json(producto);
});

app.post('/api/productos', (req, res) => {
  const { nombre, categoria, precio, stock, activo } = req.body;

  const nuevoProducto = {
    id: productos.length ? Math.max(...productos.map((item) => item.id)) + 1 : 1,
    nombre,
    categoria,
    precio,
    stock,
    activo
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

app.put('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productos.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const actual = productos[index];
  const actualizado = {
    ...actual,
    ...req.body,
    id
  };

  productos[index] = actualizado;
  return res.status(200).json(actualizado);
});

app.delete('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productos.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const eliminado = productos[index];
  productos.splice(index, 1);
  return res.status(200).json(eliminado);
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
