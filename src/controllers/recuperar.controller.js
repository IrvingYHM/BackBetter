// recuperar.controller.js
const Cliente = require("../db/models/cliente.model");

let correoRecuperar; // Variable para almacenar el correo electrónico a recuperar

async function recuperarContrasena(req, res) {
  const { vchCorreo } = req.body;

  try {
    // Verificar si el correo electrónico existe en la base de datos
    const cliente = await Cliente.findOne({ where: { vchCorreo } });

    if (!cliente) {
      // Si el correo electrónico no existe, enviar un mensaje de error
      return res.status(404).json({ message: 'El correo electrónico no está registrado' });
    }

    // Si el correo electrónico existe, almacenarlo en la variable global
    correoRecuperar = vchCorreo;

    // Enviar un mensaje de éxito
    res.status(200).json({ message: 'Correo electrónico encontrado. Se enviarán instrucciones para recuperar la contraseña.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al recuperar la contraseña" });
  }
}

async function verificarRespuesta(req, res) {
  const { vchPreguntaSecreta, vchRespuestaSecreta } = req.body;

  try {
    // Verificar si el correo electrónico y la respuesta coinciden en la base de datos
    const cliente = await Cliente.findOne({ where: { vchCorreo: correoRecuperar, vchPreguntaSecreta, vchRespuestaSecreta } });

    if (!cliente) {
      // Si la respuesta es incorrecta, enviar un mensaje de error
      return res.status(400).json({ message: 'La respuesta secreta es incorrecta' });
    }

    // Si la respuesta es correcta, enviar un mensaje de éxito
    res.status(200).json({ message: 'Respuesta secreta correcta. Puede cambiar la contraseña.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al verificar la respuesta secreta" });
  }
}

module.exports = { recuperarContrasena, verificarRespuesta };
