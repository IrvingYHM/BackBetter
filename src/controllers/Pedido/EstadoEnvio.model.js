const EstadoEnvio = require("../../db/models/Pedido/EstadoEnvio.model");

// Controlador para obtener todos los clientes
async function getAllEstadoEnvios(req, res) {
  try {
    const EstadoEnvios = await EstadoEnvio.findAll();
    res.json(EstadoEnvios);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los Estados de Pedidos" });
  }
}

module.exports = {
  getAllEstadoEnvios,
};
