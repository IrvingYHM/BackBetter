const DireccionEmpleado = require("../db/models/Direc_Empleado.model");

// Controlador para obtener todas las direcciones de los clientes
async function getAllDirec_Empleado(req, res) {
  try {
    const direc_Empleado = await DireccionEmpleado.findAll();
    res.json(direc_Empleado);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener las direcciones de los Empleados" });
  }
}

// Controlador para crear una nueva dirección de cliente
async function createDirec_Empleado(req, res) {
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
    const nuevaDirec_Empleado = await DireccionEmpleado.create({
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
    res.status(201).json(nuevaDirec_Empleado);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al crear la dirección del cliente" });
  }
}

// Controlador para actualizar una dirección de cliente
async function updateDirec_Empleado(req, res) {
  const { IdDirec_Empleado } = req.params;
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
    const direccionEmpleado = await DireccionEmpleado.findOne({
      where: { IdDirec_Empleado },
    });

    if (direccionEmpleado) {
      // Update the address with new data
      await direccionEmpleado.update({
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

      res.json(direccionEmpleado);
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
  getAllDirec_Empleado,
  createDirec_Empleado,
  updateDirec_Empleado,
};
