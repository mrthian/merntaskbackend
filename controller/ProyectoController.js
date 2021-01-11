// Importar el models
const Proyecto = require('../models/ProyectoModels');

// lEER EL EXPRESS VALIDATOR 
const { validationResult } = require('express-validator')

exports.crearProyecto = async (req, res) => {

  // Verificar la validación 
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ ok: false, errores: errores.array() })
  }

  try {
    // Creación de proyecto
    const proyecto = new Proyecto(req.body);

    // Guardar el creador del proyecto 
    proyecto.creador = req.usuario.id;

    // Guardar proyecto
    proyecto.save();

    // Retornar respuesta
    res.json({ proyecto });
  } catch (error) {
    console.log(error)
    res.status(500).send('Error en el methods');
  }
}

// Get Todos proyectos user actual
exports.listadoProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
    res.json(proyectos);
  } catch (error) {
    console.log(error)
    res.status(500).json({ ok: false, msg: error })
  }
}

// actualizar proyecto
exports.actualizarProyecto = async (req, res) => {

  // Verificar la validación 
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ ok: false, errores: errores.array() })
  }

  // extraer información del proyecto
  const { nombre } = req.body
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    let proyectoId = req.params.id;
    // validar el id
    let proyecto = await Proyecto.findById(proyectoId)

    // Validar si existe.
    if (!proyecto) return res.status(404).json({ ok: false, msg: 'Proyecto no existe' });

    // validar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ ok: false, msg: 'No autorizado para modificar el proyecto' })
    }

    // Actualizar
    proyecto = await Proyecto.findByIdAndUpdate({ _id: proyectoId }, { $set: nuevoProyecto }, { new: true })

    res.send({ok: true, proyecto})
  } catch (error) {
    console.log(error)
    res.status(500).json({ ok: false, msg: error })
  }
}

// Eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    let proyectoId = req.params.id;
    // validar el id
    let proyecto = await Proyecto.findById(proyectoId)

    // Validar si existe.
    if (!proyecto) return res.status(404).json({ ok: false, msg: 'Proyecto no existe' });

    // validar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ ok: false, msg: 'No autorizado para eliminar el proyecto' })
    }

    // Actualizar
    proyecto = await Proyecto.findOneAndRemove({ _id: proyectoId })
    if (proyecto) {
      return res.status(200).json({ok: true, msg: 'Proyecto eliminado con éxito'});
    } else {
      return res.status(200).json({ok: true, msg: 'El proyecto no pudo ser eliminado. Intente de nuevo mas tarde'});
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ ok: false, msg: error })
  }
}