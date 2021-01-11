const mongoose = require('mongoose')

// Crear el schema o collection
const ProyectoSchema = mongoose.Schema({
  nombre: { type: String, require: true, trim: true },
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  creado: { type: Date, default: Date.now() }
})

// Exportar el modelo 
module.exports = mongoose.model('Proyecto', ProyectoSchema)