const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {

  // Leer el token del header
  const token = req.header('x-auth-token')

  // Verificar si no hay token
  if (!token) {
    return res.this.status(401).json({ ok: false, msg: 'No se encontro el parametro token' })
  }

  // validar token
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA)
    req.usuario = cifrado.usuario
    next()
  } catch (error) {
    return res.status(401).json({ ok: false, msg: 'token no valido'})
  }  
}