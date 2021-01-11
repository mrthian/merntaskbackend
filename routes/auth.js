/**
 * Route para authenticar usuarios 
 */
const express = require('express');
const router = express.Router();

// express-validator
const { check } = require('express-validator');

// Importar controlador
const AuthController = require('../controller/AuthController');

// Midleware 
const AuthMiddleware = require('../middleware/md-auth');

// Creación de usuarios
const validar = [
  check('email', 'Agregar un email valido').isEmail(),
  check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }),
];
router.post('/', validar, AuthController.authUsuario);

const validarAuth = []
router.get('/', [AuthMiddleware], AuthController.getUsuarioAuth );

module.exports = router;