/**
 * Route para crear usuarios
 */
const express = require('express');
const router = express.Router();

// Importar controlador
const UsuarioController = require('../controller/UsuarioController');

// express-validator
const { check } = require('express-validator');

// Crear un usuario

/**
 * API de usuarios
 */

// Consultar usauarios

// Creación de usuarios
const validar = [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'Agregar un email valido').isEmail(),
  check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }),
];

router.post('/', validar, UsuarioController.crearUsuaruio);

module.exports = router;