const express = require('express')
const router = express.Router();
const { check } = require('express-validator')

// Importar el controller
const TareaController = require('../controller/TareaController');

// middleware
const authMiddleware = require('../middleware/md-auth')

// Crear proyectos
// api/task


// 1- consultar listado de tareas por proyecto
router.get('/', [authMiddleware], TareaController.listadoTareas);

// 2- Crear tarea nueva
const validarPost = [
  check('nombre', 'El nombre de la tarea no puede ser vacia').not().isEmpty(),
  check('proyecto', 'El proyecto no puede ser vacio').not().isEmpty()
]
router.post('/', [authMiddleware], validarPost, TareaController.crearTarea
);

// 3- Actualizar tarea
const validarUpdate = [
  check('nombre', 'El Nombre de la tarea no puede ser vacio').not().isEmpty()
]
router.put('/:id', [authMiddleware], validarUpdate, TareaController.actualizarTarea);

const validarDelete = [
  check('proyecto', 'El id del proyecto es obligatorio').not().isEmpty(),
]
router.delete('/:id', [authMiddleware], validarDelete, TareaController.eliminarTarea);

module.exports = router;