// db/controllers/carrito.controller.js
const  TipoCita  = require('../../db/models/Citas/TipoCita.model');



// Controlador para obtener todos los clientes
async function getAllTipoCitas(req, res) {
  try {
    const TipoCitas = await TipoCita.findAll();
    res.json(TipoCitas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los tipos de citas" });
  }
}




module.exports = {
  getAllTipoCitas
};