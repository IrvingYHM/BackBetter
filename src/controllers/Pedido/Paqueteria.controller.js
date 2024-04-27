const Paqueteria = require('../../db/models/Pedido/Paqueteria.model');



// Controlador para obtener todos los clientes
async function getAllPaqueterias(req, res) {
    try {
      const Paqueterias = await Paqueteria.findAll();
      res.json(Paqueterias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener las paqueterias" });
    }
  }


  
module.exports = {
    getAllPaqueterias
};