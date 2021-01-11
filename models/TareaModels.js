const mongoose = require('mongoose')

// Crear el schema o collection
const TareaSchema = mongoose.Schema({
  nombre: { type: String, require: true, trim: true },
  estado: { type: Boolean, default: false},
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto' },
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  creado: { type: Date, default: Date.now() }
})

// Exportar el modelo 
module.exports = mongoose.model('Tarea', TareaSchema)