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
                    pregunta: `Pregunta ${parseInt(index) + 1}`,
                    tipoPregunta: 'Cerrada',
                    respuesta: `Estrellas: ${calificacion}`,
                })
            )
        );

        res.status(201).json({
            message: 'Encuesta guardada exitosamente',
            data: encuestas,
        });
    } catch (error) {
        console.error('Error al guardar encuesta:', error);
        res.status(500).json({ message: 'Error al guardar la encuesta.', error: error.message });
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
    obtenerResultadosEncuestas
};