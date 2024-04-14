const DireccionCliente = require("../db/models/Direc_Client.model");

// Controlador para obtener todas las direcciones de los clientes
async function getAllDirec_Clientes(req, res) {
  try {
    const direc_Client = await DireccionCliente.findAll();
    res.json(direc_Client);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener las direcciones de los clientes" });
  }
}

// Controlador para crear una nueva dirección de cliente
async function createDirec_Client(req, res) {
  const {
    Estado,
    CP,
    Municipio,
    Colonia,
    Calle,
    NumExt,
    NumInt,
    Referencia,
    IdCliente,
  } = req.body;
  try {
    const nuevaDirec_Cliente = await DireccionCliente.create({
      Estado,
      CP,
      Municipio,
      Colonia,
      Calle,
      NumExt,
      NumInt,
      Referencia,
      IdCliente,
    });
    res.status(201).json(nuevaDirec_Cliente);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al crear la dirección del cliente" });
  }
}

module.exports = {
  getAllDirec_Clientes,
  createDirec_Client,
};
