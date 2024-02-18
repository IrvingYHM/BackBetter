// recuperar.controller.js
const Cliente = require("../db/models/cliente.model");

async function recuperarContrasena(req, res) {
  const { vchCorreo } = req.body;

  try {
    // Verificar si el correo electrónico existe en la base de datos
    const cliente = await Cliente.findOne({ where: { vchCorreo } });

    if (!cliente) {
      // Si el correo electrónico no existe, enviar un mensaje de error
      return res.status(404).json({ message: 'El correo electrónico no está registrado' });
    }

    // Si el correo electrónico existe, enviar un mensaje de éxito
    res.status(200).json({ message: 'Correo electrónico encontrado. Se enviarán instrucciones para recuperar la contraseña.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al recuperar la contraseña" });
  }
}

module.exports = { recuperarContrasena };