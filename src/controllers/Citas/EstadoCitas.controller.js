// db/controllers/carrito.controller.js
const  EstadoCita  = require('../../db/models/Citas/EstadoCita.model');



// Controlador para obtener todos los clientes
async function getAllEstadoCitas(req, res) {
  try {
    const EstadoCitas = await EstadoCita.findAll();
    res.json(EstadoCitas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los Estados de las Citas" });
  }
}




module.exports = {
  getAllEstadoCitas
};