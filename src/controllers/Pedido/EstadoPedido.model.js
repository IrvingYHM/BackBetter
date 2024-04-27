const EstadoPedido = require('../../db/models/Pedido/EstadoPedido.model');



// Controlador para obtener todos los clientes
async function getAllEstadoPedidos(req, res) {
    try {
      const EstadoPedidos = await EstadoPedido.findAll();
      res.json(EstadoPedidos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los Estados de Pedidos" });
    }
  }

module.exports = {
    getAllEstadoPedidos,
  };