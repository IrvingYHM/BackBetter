// db/controllers/carrito.controller.js
const Cita = require("../../db/models/Citas/Cita.model");

// Controlador para obtener todos los clientes
async function getAllCitas(req, res) {
  try {
    const citas = await Cita.findAll();
    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las citas" });
  }
}

module.exports = {
  getAllCitas
};
