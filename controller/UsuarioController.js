const UsuarioModel = require('../models/UsuarioModels');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuaruio = async (req, res) => {

  // Verificar si no hay errores en el REQUEST
  const errores = validationResult(req);

  // retorna un arreglo de errores
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      msg: 'Error en los parametros de entrada',
      errores: errores.array()
    })
  }

  // Obtener los parametros de entrada.
  let { email, password } = req.body;

  try {
    // Validar que usuario ingresado sea único.
    let usuario = await UsuarioModel.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe'
      });
    }

    // Crear el Objecto usuario Temporalmente
    usuario = new UsuarioModel(req.body);

    // Generar HASH de la clave
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    // Guardar el Usuario en la base de datos.
    await usuario.save();

    /***************************************************************** */
    // Crear y firmar el JWT | Información que lleva el JSON Web Token
    const payload = {
      usuario: {
        id: usuario._id,
        email: usuario.email      
      }
    }

    // Firmar el token
    jwt.sign(payload, process.env.SECRETA, {
      expiresIn: 3600
    }, (err, token) => {

      if (err) throw error;

      // Mensaje de confirmación
      res.json({ ok: true, token });
    });
    /***************************************************************** */
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: error
    })
  }
}

// Eliminar el usuario
exports.eliminarUsuario = async (req, res) => {
  res.json({ ok: false, msg: '' })
}