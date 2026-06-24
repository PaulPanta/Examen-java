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
