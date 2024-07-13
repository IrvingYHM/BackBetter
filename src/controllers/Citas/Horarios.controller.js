// db/controllers/horarios.controller.js
const Horarios = require("../../db/models/Citas/Horarios.model");

// Obtener todos los Horarios
async function getAllHorarios(req, res) {
  try {
    const horarios = await Horarios.findAll();
    res.json(horarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los Horarios" });
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
  getAllHorarios,
  getHorarioById,
  createHorario,
  updateHorario,
  deleteHorario,
};
