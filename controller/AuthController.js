const UsuarioModel = require('../models/UsuarioModels');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// API/AUTH
exports.authUsuario = async (req, res) => {
  // Verificar si no hay errores en el REQUEST
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      msg: 'Error en los parametros de entrada',
      errores: errores.array()
    })
  }

  const { email, password } = req.body;

  try {
    // Validar que usuario exista
    let usuario = await UsuarioModel.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ ok: false, msg: 'El email no existe' })
    }

    // Verificar password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ ok: false, msg: 'Password incorrecto' });
    }

    // Si todo es correcto se firma el JWT (token)
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
    console.log('Catch', error);
    return res.json({ ok: false, msh: error })
  }
}

// Obtener el usuario autenticado
exports.getUsuarioAuth = async (req, res) => {
  try {
    // const usuario = await req.usuario;    
    const usuario = await UsuarioModel.findById(req.usuario.id);
    if (!usuario) {
      return req.status(404).json({
        ok: false,
        msg: `Usuario ${req.usuario.email} no encontrado`
      });
    }

    res.json({
      ok: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        registro: usuario.registro
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error' })
  }
}
