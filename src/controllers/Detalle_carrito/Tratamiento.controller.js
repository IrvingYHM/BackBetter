// db/controllers/carrito.controller.js
const Tratamiento = require("../../db/models/Detalle_carrito/Tratamiento.model");

// Controlador para obtener todos los clientes
async function getAllTratamiento(req, res) {
  try {
    const tratamiento = await Tratamiento.findAll();
    res.json(tratamiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los tratamientos" });
  }
}

module.exports = {
  getAllTratamiento,
};
