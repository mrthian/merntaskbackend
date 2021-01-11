// Importar el models
const Tarea = require('../models/TareaModels');
const Proyecto = require('../models/ProyectoModels');

// lEER EL EXPRESS VALIDATOR 
const { validationResult } = require('express-validator')

// Listar tarea
exports.listadoTareas = async (req, res) => {

  //console.log('req.body: ', req.body)
  //console.log('req.query: ', req.query)
  //console.log('req.params: ', req.params)
  try {
    // Validar que el proyecto exista
    //let { proyecto } = req.body
    let { proyecto } = req.query
    //console.log('ID -----------------------')
    //console.log('Id: ', proyecto); 
    //console.log('--------------------------')
    proyecto = await Proyecto.findById(proyecto)
    if (!proyecto) {
      return res.status(404).json({ ok: false, msg: 'El proyecto no existe' })
    }
    //console.log('')
    //console.log('Objecto-------------------')
    //console.log('Objecto: ', proyecto); 
    //console.log('--------------------------')

    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ ok: false, msg: 'No Autorizado' });
    }

    let tareas = await Tarea.find({ proyecto: proyecto._id });
    if (!tareas) {
      return res.status(404).json({ ok: false, msg: 'No se encontraron tareas para el proyecto' })
    }

    res.json({ tareas });

  } catch (error) {
    console.log('Error: ', error)
    res.status(500).json({ ok: false, msg: error, error })
  }
}

// Crear tarea
exports.crearTarea = async (req, res) => {
  // Validar si el JSON tiene errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) return res.status(400).json({ ok: false, errores: errores.array() })

  try {
    // Validar el proyecto exista
    let { proyecto } = req.body

    proyecto = await Proyecto.findById(proyecto)
    if (!proyecto) {
      return res.status(404).json({ ok: false, msg: 'Proyecto no encontrado' })
    }

    // Validar si el proyecto actual pertenece al usuario Auth
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ ok: false, msg: 'No autorizado' });
    }

    // Crear la tarea.
    let tarea = new Tarea(req.body)
    tarea.creador = req.usuario.id
    tarea.save();

    res.json({ ok: true, msg: 'Tarea creada con éxito', tarea })
  } catch (error) {
    console.log('Error: ', error)
    res.status(500).json({ ok: false, msg: error, error })
  }
}

// Actualizar tarea
exports.actualizarTarea = async (req, res) => {
  // Validar si el JSON tiene errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) return res.status(400).json({ ok: false, errores: errores.array() })

  try {
    // Obtener parmetros de entrada
    let tareaId = req.params.id;
    let { proyecto, nombre, estado } = req.body

    // Validar | Buscar el proyecto 
    proyecto = await Proyecto.findById(proyecto);

    if (!proyecto) {
      return res.status(404).json({ ok: false, msg: 'Proyecto no encontrado' })
    }

    // Validar si el proyecto actual pertenece al usuario Auth
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ ok: false, msg: 'No autorizado' });
    }

    // Crear object actulizar
    let nuevaTarea = {}
    nuevaTarea.nombre = nombre
    nuevaTarea.estado = estado

    // Buscar tarea
    let tarea = await Tarea.findById(tareaId);
    if (!tarea) {
      return res.status(404).json({ ok: false, msg: 'Tarea no existe' })
    }

    // Guardar la tarea
    tarea = await Tarea.findOneAndUpdate({ _id: tareaId }, nuevaTarea, { new: true });
    res.json({ ok: true, msg: 'tarea modificada con éxito', tarea });
  } catch (error) {
    console.log('Error: ', error)
    res.status(500).json({ ok: false, msg: error })
  }
}

// Eliminar una tarea por ID
exports.eliminarTarea = async (req, res) => {
  try {
    //let { proyecto } = req.body
    let { proyecto } = req.query

    // 1- validar si la tarea existe
    let tarea = await Tarea.findById(req.params.id)

    if (!tarea) return res.status(404).json({ ok: false, msg: 'Tarea no existe' });

    // 2- Valida project and owner del proyecto 
    proyecto = await Proyecto.findById(proyecto);
    if (!proyecto) return res.status(404).json({ ok: false, msg: 'Proyecto no existe' })

    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(404).json({ ok: false, msg: 'No autorizado' })
    }

    // 3- Eliminar tarea
    await Tarea.findOneAndRemove({ _id: req.params.id })
    res.json({ ok: true, msg: 'Tarea eliminada con éxito' })
  } catch (error) {
    console.log('Error: ', error)
    res.status(500).json({ ok: false, msg: error })
  }
}