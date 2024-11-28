const Encuesta = require('../db/models/feedbackMovil.model'); // Modelo de la encuesta

// Función para crear la encuesta
const crearEncuesta = async (req, res) => {
    try {
        const { idUsuario, respuestas } = req.body;

        // Validación básica
        if (!idUsuario || !respuestas) {
            return res.status(400).json({ message: 'Faltan datos para guardar la encuesta.' });
        }

        // Verificar si el usuario ya completó la encuesta
        const encuestaExistente = await Encuesta.findOne({
            where: {
                idUsuario: idUsuario,
                modulo: 'Citas',
            },
        });

        if (encuestaExistente) {
            return res.status(409).json({ message: 'El usuario ya completó la encuesta.' });
        }

        // Guardar cada respuesta en la base de datos
        const encuestas = await Promise.all(
            Object.entries(respuestas).map(([index, calificacion]) =>
                Encuesta.create({
                    idUsuario: idUsuario, // Asociar con el usuario
                    modulo: 'Citas',
                    pregunta1: ``,
                    tipoPregunta: 'Cerrada',
                    respuesta: `Estrellas: ${calificacion}`,
                    estado: 'pendiente' // Estado inicial
                })
            )
        );

        // Actualizar el estado de todas las respuestas de esta encuesta a "completado"
        await Encuesta.update(
            { estado: 'completado' },
            { where: { idUsuario: idUsuario, modulo: 'Citas' } }
        );

        res.status(201).json({
            message: 'Encuesta guardada y marcada como completada exitosamente',
            data: encuestas,
        });
    } catch (error) {
        console.error('Error al guardar encuesta:', error);
        res.status(500).json({ message: 'Error al guardar la encuesta.', error: error.message });
    }
};

const guardarEncuestaPendiente = async (req, res) => {
    const { idUsuario } = req.body;
  
    if (!idUsuario) {
      return res.status(400).json({ message: "ID del cliente es requerido" });
    }
  
    try {
      // Guardar la encuesta pendiente en la base de datos
      await Encuesta.update(
        {estado: 'pendiente'},
        {
            where: {
                idUsuario: idUsuario,
                modulo: 'Citas',
                
            }
        }
        );
  
      return res.status(200).json({ message: "Encuesta guardada como pendiente", encuesta });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al guardar la encuesta pendiente" });
    }
  };
// Función para verificar si el usuario ya completó la encuesta
const verificarEncuesta = async (req, res) => {
    try {
        const { idUsuario } = req.query; // Suponiendo que se pasa el idUsuario como parámetro

        // Verificar si el usuario ya completó la encuesta
        const encuestaExistente = await Encuesta.findOne({
            where: {
                idUsuario: idUsuario,
                modulo: 'Citas',
                estado: 'completado'
            },
        });

        if (encuestaExistente) {
            return res.json({ completada: true });
        }

        res.json({ completada: false });
    } catch (error) {
        console.error("Error al verificar encuesta:", error);
        res.status(500).json({ message: "Error al verificar encuesta." });
    }
};

//
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
      return res.status(500).json({ error: "Error en el servidor:"});
    }
};
// Función para obtener los resultados de las encuestas
const obtenerResultadosEncuestas = async (req, res) => {
    try {
        // Obtener todas las encuestas relacionadas con el módulo 'Citas'
        const encuestas = await Encuesta.findAll({
            where: { modulo: 'Citas' }
        });

        if (!encuestas || encuestas.length === 0) {
            return res.status(404).json({ message: 'No hay encuestas completadas aún.' });
        }

        // Procesar las respuestas para cada pregunta
        const respuestasPorPregunta = {};

        // Contar las respuestas por cada pregunta
        encuestas.forEach((encuesta) => {
            const { pregunta, respuesta } = encuesta;

            // Si la pregunta no existe en el objeto, la inicializamos
            if (!respuestasPorPregunta[pregunta]) {
                respuestasPorPregunta[pregunta] = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
            }

            // Extraemos el valor de la calificación (asumimos que el formato es 'Estrellas: X')
            const calificacion = respuesta.replace('Estrellas: ', '');

            // Incrementamos el contador para la calificación correspondiente
            if (respuestasPorPregunta[pregunta][calificacion] !== undefined) {
                respuestasPorPregunta[pregunta][calificacion]++;
            }
        });

        // Formateamos los datos para la gráfica
        const resultados = Object.keys(respuestasPorPregunta).map((pregunta) => {
            return {
                pregunta,
                respuestas: respuestasPorPregunta[pregunta]
            };
        });

        res.status(200).json({
            message: 'Resultados de las encuestas obtenidos con éxito',
            data: resultados
        });
    } catch (error) {
        console.error("Error al obtener resultados de la encuesta:", error);
        res.status(500).json({ message: "Error al obtener los resultados de la encuesta.", error: error.message });
    }
};

module.exports = {
    crearEncuesta,
    verificarEncuesta,  // Asegúrate de exportar la nueva función
    guardarEncuestaPendiente,
    registrarAccesoFeedback,
    completarEncuesta,
    obtenerEncuestaPendiente,
    obtenerResultadosEncuestas,
    
};
