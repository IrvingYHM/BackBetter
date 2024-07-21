// src/controllers/Citas/cita.controller.js
const Cita = require("../../db/models/Citas/Cita.model");
const TipoCita = require("../../db/models/Citas/TipoCita.model");

// Obtener todas las citas
async function getCitas(req, res) {
  try {
    const citas = await Cita.findAll();
    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las citas" });
  }
}

// Obtener una cita por ID
async function getCitaById(req, res) {
  try {
    const id = req.params.id;
    const cita = await Cita.findByPk(id);
    if (cita) {
      res.json(cita);
    } else {
      res.status(404).json({ message: "Cita no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la cita" });
  }
}

// Crear una nueva cita
async function createCita(req, res) {
  try {
    const {
      Fecha,
      Hora,
      IdCliente,
      IdTipoCita,
      Costo,
      IdEstadoCita,
      Observaciones,
      DescripcionT,
    } = req.body;
    
    // Verifica que IdTipoCita exista en la tabla tbltipo_cita antes de crear la cita
    const tipoCitaExiste = await TipoCita.findByPk(IdTipoCita);
    if (!tipoCitaExiste) {
      return res.status(400).json({ message: "El tipo de cita no existe" });
    }

    const nuevaCita = await Cita.create({
      Fecha,
      Hora,
      IdCliente,
      IdTipoCita,
      Costo,
      IdEstadoCita,
      Observaciones,
      DescripcionT,
    });

    res.status(201).json(nuevaCita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la cita" });
  }
}

// Actualizar una cita existente
async function updateCita(req, res) {
  try {
    const { id } = req.params;
    const {
      Fecha,
      Hora,
      IdCliente,
      IdTipoCita,
      Costo,
      IdEstadoCita,
      Observaciones,
      DescripcionT,
    } = req.body;
    const cita = await Cita.findByPk(id);
    if (cita) {
      cita.Fecha = Fecha;
      cita.Hora = Hora;
      cita.IdCliente = IdCliente;
      cita.IdTipoCita = IdTipoCita;
      cita.Costo = Costo;
      cita.IdEstadoCita = IdEstadoCita;
      cita.Observaciones = Observaciones;
      cita.DescripcionT = DescripcionT;
      await cita.save();
      res.json(cita);
    } else {
      res.status(404).json({ message: "Cita no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la cita" });
  }
}

// Eliminar una cita
async function deleteCita(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Cita.destroy({ where: { IdCita: id } });
    if (deleted) {
      res.json({ message: "Cita eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Cita no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la cita" });
  }
}

// Verificar disponibilidad de horarios
async function checkAvailability(req, res) {
  try {
    const { Fecha, Hora } = req.body;
    console.log(`Verificando disponibilidad para la fecha ${Fecha} y hora ${Hora}`);
    
    // Temporal: Imprimir todas las citas para depuración
    const todasLasCitas = await Cita.findAll();
    console.log('Todas las citas en la base de datos:', todasLasCitas);

    if (!Fecha || !Hora) {
      return res.status(400).json({ message: "Fecha y Hora son requeridos" });
    }

    const citaExistente = await Cita.findOne({ where: { Fecha, Hora } });
    console.log('Resultado de la búsqueda de cita existente:', citaExistente);

    if (citaExistente) {
      return res.status(409).json({ message: "El horario no está disponible" });
    } else {
      return res.status(200).json({ message: "El horario está disponible" });
    }
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error al verificar disponibilidad de horarios" });
  }
}

module.exports = {
  getCitas,
  getCitaById,
  createCita,
  updateCita,
  deleteCita,
  checkAvailability,
};
