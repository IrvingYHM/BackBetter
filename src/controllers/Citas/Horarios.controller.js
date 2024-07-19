// db/controllers/horarios.controller.js
const Horarios = require("../../db/models/Citas/Horarios.model");

// Obtener todos los horarios disponibles
async function getHorariosDisponibles(req, res) {
  try {
    const horarios = await Horarios.findAll({ where: { Disponible: true } });
    res.status(200).json(horarios);
  } catch (error) {
    console.error("Error al obtener horarios disponibles:", error);
    res.status(500).json({ message: "Error al obtener horarios disponibles" });
  }
}

// Obtener horarios disponibles para una fecha específica
const getHorariosPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query; // Obtener la fecha de la consulta

    if (!fecha) {
      return res.status(400).json({ message: 'Fecha es requerida.' });
    }

    // Buscar horarios disponibles para la fecha especificada
    const horarios = await Horarios.findAll({
      where: {
        Fecha: fecha,
        Disponible: true
      }
    });

    if (horarios.length === 0) {
      return res.status(404).json({ message: 'No hay horarios disponibles para la fecha seleccionada.' });
    }

    return res.json(horarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener horarios.' });
  }
};

// Marcar un horario como no disponible (reservar).
async function reservarHorario(req, res) {
  try {
    const { Fecha, Hora } = req.body;
    const horario = await Horarios.findOne({ where: { Fecha, Hora } });

    if (horario) {
      if (horario.Disponible) {
        horario.Disponible = false;
        await horario.save();
        res.status(200).json({ message: "Horario reservado exitosamente" });
      } else {
        res.status(409).json({ message: "El horario ya está reservado" });
      }
    } else {
      res.status(404).json({ message: "El horario no existe" });
    }
  } catch (error) {
    console.error("Error al reservar horario:", error);
    res.status(500).json({ message: "Error al reservar horario" });
  }
}

// Obtener un Horario por ID
async function getHorarioById(req, res) {
  try {
    const id = req.params.id;
    const horario = await Horarios.findByPk(id);
    if (horario) {
      res.json(horario);
    } else {
      res.status(404).json({ message: "Horario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el Horario" });
  }
}

// Crear un nuevo Horario
async function createHorario(req, res) {
  try {
    const { Hora, Dia } = req.body;
    const nuevoHorario = await Horarios.create({ Hora, Dia });
    res.status(201).json(nuevoHorario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el Horario" });
  }
}

// Actualizar un Horario existente
async function updateHorario(req, res) {
  try {
    const { id } = req.params;
    const { Hora, Dia } = req.body;
    const horario = await Horarios.findByPk(id);
    if (horario) {
      horario.Hora = Hora;
      horario.Dia = Dia;
      await horario.save();
      res.json(horario);
    } else {
      res.status(404).json({ message: "Horario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el Horario" });
  }
}

// Eliminar un Horario
async function deleteHorario(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Horarios.destroy({
      where: { IdHorarios: id },
    });
    if (deleted) {
      res.json({ message: "Horario eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Horario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el Horario" });
  }
}

module.exports = {
  getHorariosDisponibles,
  getHorariosPorFecha,
  reservarHorario,
  getHorarioById,
  createHorario,
  updateHorario,
  deleteHorario,
};
