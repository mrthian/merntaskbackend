const express = require('express')
const router = express.Router();
const { check } = require('express-validator')

// Importar el controller
const ProyectoController = require('../controller/ProyectoController');

// middleware
const authMiddleware = require('../middleware/md-auth')


// Crear proyectos
// api/project
router.post('/',
  [authMiddleware],
  [check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()],
  ProyectoController.crearProyecto)

// Consultar todos los proyectos por usuario for ID
router.get('/', [authMiddleware], ProyectoController.listadoProyectos)

// Modificar proyecto
router.put('/:id',
  [authMiddleware],
  [check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()],
  ProyectoController.actualizarProyecto)

// Eliminar un proyecto
router.delete('/:id', [authMiddleware], ProyectoController.eliminarProyecto)

module.exports = router;