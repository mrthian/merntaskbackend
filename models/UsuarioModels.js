const mongoose = require('mongoose');

// Crear la collection 
const UsuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true, 
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true, 
    trim: true,
  },
  registro: {
    type: Date,
    default: Date.now()
  },
  google: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);