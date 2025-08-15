const DireccionCliente = require("../db/models/Direc_Client.model");
const Cliente = require('./cliente.controller'); // Importa el modelo de Categoria


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

// Controlador para actualizar una dirección de cliente
async function updateDirec_Client(req, res) {
  const { IdDirec_Client } = req.params;
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
    const direccionCliente = await DireccionCliente.findOne({
      where: { IdDirec_Client },
    });

    if (direccionCliente) {
      // Update the address with new data
      await direccionCliente.update({
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

      res.json(direccionCliente);
    } else {
      res.status(404).json({ message: "Dirección no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar la dirección del cliente" });
  }
}

module.exports = {
  getAllDirec_Clientes,
  createDirec_Client,
  updateDirec_Client,
};

/* DireccionCliente.belongsTo(Cliente, { foreignKey: 'IdCliente', as: 'idcliente' }); */
