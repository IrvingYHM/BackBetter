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
  


 // Función para obtener los resultados de las encuestas completadas
const obtenerResultadosEncuestas = async (req, res) => {
    try {
      // Obtener todas las encuestas completadas
      const encuestasCompletadas = await Encuesta.findAll({
        where: { estado: 'Realizado' },
      });
  
      if (encuestasCompletadas.length === 0) {
        return res.status(200).json({ mensaje: "No hay encuestas completadas." });
      }
  
      // Inicializar el objeto de resultados por calificación (1-5) para cada pregunta
      const resultados = {
        question1: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
        question2: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
        question3: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
        question4: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
        question5: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
      };
  
      // Contabilizar las respuestas de cada encuesta
      encuestasCompletadas.forEach(encuesta => {
        // Aquí supondremos que las respuestas son números entre 1 y 5 para cada pregunta
        for (let i = 1; i <= 5; i++) {
          if (encuesta[`question${i}`]) {
            resultados[`question${i}`][encuesta[`question${i}`]]++;
          }
        }
      });
  
      // Calcular el total de personas que respondieron la encuesta
      const totalPersonas = encuestasCompletadas.length;
  
      // Responder con los resultados de las preguntas y el total de personas
      res.status(200).json({ data: resultados, totalPersonas: totalPersonas });
    } catch (error) {
      console.error("Error al obtener los resultados de las encuestas:", error);
      return res.status(500).json({ error: "Error al obtener los resultados de las encuestas.", detalles: error.message });
    }
  };
  

module.exports = {
  registrarAccesoFeedback,
  completarEncuesta,
  obtenerEncuestaPendiente, 
  obtenerResultadosEncuestas,

};
