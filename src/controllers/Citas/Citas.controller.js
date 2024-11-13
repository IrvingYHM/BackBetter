// src/controllers/Citas/cita.controller.js
const Cita = require("../../db/models/Citas/Cita.model");
const TipoCita = require("../../db/models/Citas/TipoCita.model");
const  Suscripcion  = require('../../db/models/suscripciones.model'); // Asegúrate de que la importación sea correcta


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

// Obtener citas por ID de usuario
async function getCitasByUserId(req, res) {
  try {
    const idCliente = req.params.idCliente;
    const citas = await Cita.findAll({
      where: { IdCliente: idCliente }
    });
    if (citas.length > 0) {
      res.json(citas);
    } else {
      res.status(404).json({ message: "No se encontraron citas para este usuario" });
    }
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

    // Obtener suscripciones activas del cliente
    const suscripciones = await Suscripcion.findAll({
      where: { IdCliente, Estado: 'activo' }
    });

    const payload = JSON.stringify({
      title: 'Nueva cita agendada',
      body: `Tienes una cita programada para el ${Fecha} a las ${Hora}.`,
      icon: '/img/notificacion.jpg',
      vibrate: [100, 50, 100],
      actions: [
        {
          action: "view",
          title: "Ver detalles de la cita",
          url: `https://opticenter-hue.vercel.app/citas/${nuevaCita.id}` // URL donde se puede ver la cita
        }
      ]
    });

    // Enviar notificaciones a las suscripciones del cliente
    suscripciones.forEach(subscription => {
      try {
        const keys = subscription.Keys ? JSON.parse(subscription.Keys) : null;
        if (!keys || !keys.p256dh || !keys.auth) return;

        webpush.sendNotification({
          endpoint: subscription.Endpoint,
          keys: {
            p256dh: keys.p256dh,
            auth: keys.auth
          }
        }, payload).catch(console.error);
      } catch (error) {
        console.error('Error al enviar notificación:', error);
      }
    });

    res.status(201).json(nuevaCita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la cita' });
  }
}

// Crear una nueva cita
/* async function createCita(req, res) {
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
} */

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

// Cancela una cita
const cancelarCita = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la cita desde los parámetros de la solicitud

  try {
    // Busca la cita por ID
    const cita = await Cita.findByPk(id);

    // Verifica si la cita existe
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    // Verifica si la cita ya está cancelada
    if (cita.IdEstadoCita === 4) {
      return res
        .status(400)
        .json({ message: "La cita ya está cancelada" });
    }

    // Cambia el estado de la cita a "Cancelada" (ID 4)
    cita.IdEstadoCita = 4;
    await cita.save();

    return res.status(200).json({ message: "Cita cancelada exitosamente" });
  } catch (error) {
    console.error("Error al cancelar la cita:", error);
    return res
      .status(500)
      .json({ message: "Error al cancelar la cita", error });
  }
};

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
  getCitasByUserId,
  getCitaById,
  createCita,
  updateCita,
  cancelarCita,
  checkAvailability,
};
