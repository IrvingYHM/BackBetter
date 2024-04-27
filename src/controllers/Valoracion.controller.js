// db/controllers/carrito.controller.js
const  Valoracion  = require('../db/models/valoracion.model');



// Controlador para obtener todos los clientes
async function getAllValoracion(req, res) {
  try {
    const Valoraciones = await Valoracion.findAll();
    res.json(Valoraciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los Valoraciones" });
  }
}


module.exports = {
    getAllValoracion
}