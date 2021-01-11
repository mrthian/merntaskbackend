/**
 * @author: Cristian Camilo Giraldo
 */

const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// Crear servidor
const app = express();

// Conectar a la bd
conectarDB();

// Habilitar cors 
app.use(cors());

// Habilitar express.json | Trabajar con json
app.use(express.json({ extended: true }));

// Puerto del servidor APP
const PORT = process.env.PORT || 4000;

// Definir lap agina principal
app.get('/', (req, res) => {
  res.send('Servidor MERN')
})

// importar todas nuestras routes
app.use('/api/users', require('./routes/usuario'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/project', require('./routes/proyecto'));
app.use('/api/task', require('./routes/tarea'));

// INICIAR Servidor
app.listen(PORT, () => {
  console.log(`El servidor esta funcionando por el PORT ${PORT}`)
})