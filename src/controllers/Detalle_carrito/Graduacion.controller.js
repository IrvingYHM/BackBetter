// db/controllers/carrito.controller.js
const  Graduacion  = require('../../db/models/Detalle_carrito/Graduacion.model');



// Controlador para obtener todos los clientes
async function getAllGraduacion(req, res) {
  try {
    const graduacion = await Graduacion.findAll();
    res.json(graduacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las graduaciones" });
  }
}




module.exports = {
    getAllGraduacion
};