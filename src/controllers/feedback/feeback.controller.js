const Encuesta = require('../../db/models/feedback/feedback.model'); 

// Función para registrar el acceso a la encuesta
const registrarAccesoFeedback = async (req, res) => {
    const { idUsuario } = req.body;

    if (!idUsuario || isNaN(idUsuario)) {
        return res.status(400).json({ error: "El idUsuario debe ser un número válido." });
    }

    try {
        // Verificar si ya existe una encuesta pendiente o completada
        const encuestaExistente = await Encuesta.findOne({
            where: { idUsuario, estado: 'Realizado' },
        });

        if (encuestaExistente) {
            return res.status(200).json({ estado: 'Encuesta ya completada' });
        }

        // Verificar si hay una encuesta pendiente
        const encuestaPendiente = await Encuesta.findOne({
            where: { idUsuario, estado: 'Pendiente' },
        });

        // Si no existe encuesta pendiente, crear una nueva
        if (!encuestaPendiente) {
            const nuevaEncuesta = await Encuesta.create({
                idUsuario,
                estado: 'Pendiente',
            });

            return res.status(200).json({ estado: 'Encuesta registrada', id_encuesta: nuevaEncuesta.id });
        }

        return res.status(200).json({ estado: 'Encuesta pendiente' });

    } catch (error) {
        console.error("Error al registrar la encuesta:", error);
        return res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
};
// Función para completar la encuesta
const completarEncuesta = async (req, res) => {
    try {
      const { idUsuario, question1, question2, question3, question4, question5 } = req.body;

      if (!idUsuario) {
        return res.status(400).json({ error: "El idUsuario es obligatorio." });
      }

      if (![question1, question2, question3, question4, question5].every(q => Number.isInteger(q))) {
        return res.status(400).json({ error: "Todas las preguntas deben tener respuestas válidas." });
      }

      const encuesta = await Encuesta.findOne({
        where: { idUsuario, estado: "Pendiente" },
      });

      if (!encuesta) {
        return res.status(404).json({ error: "No se encontró una encuesta pendiente para este usuario." });
      }

      encuesta.question1 = question1;
      encuesta.question2 = question2;
      encuesta.question3 = question3;
      encuesta.question4 = question4;
      encuesta.question5 = question5;
      encuesta.estado = "Realizado"; 

      await encuesta.save();

      res.status(200).json({ message: "Encuesta completada exitosamente.", encuesta });
    } catch (error) {
      res.status(500).json({ error: "Error al completar la encuesta", detalles: error.message });
    }
};


// Función para verificar si el usuario tiene una encuesta pendiente
const obtenerEncuestaPendiente = async (req, res) => {
    const { idUsuario } = req.body;
  
    // Validación para verificar si idUsuario es un número válido
    if (!idUsuario || isNaN(idUsuario)) {
      return res.status(400).json({ error: "El idUsuario debe ser un número válido." });
    }
  
    try {
      const encuestaPendiente = await Encuesta.findOne({
        where: { idUsuario, estado: 'Pendiente' },
      });
  
      if (encuestaPendiente) {
        return res.status(200).json({
          estado: 'Pendiente',
          id_encuesta: encuestaPendiente.id,
          mensaje: "Tienes una encuesta pendiente.",
        });
      } else {
        return res.status(200).json({
          estado: 'Completado',
          mensaje: "No tienes una encuesta pendiente.",
        });
      }
    } catch (error) {
      console.error("Error al verificar la encuesta pendiente:", error);
      return res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
  };
  

module.exports = {
  registrarAccesoFeedback,
  completarEncuesta,
  obtenerEncuestaPendiente, 

};
