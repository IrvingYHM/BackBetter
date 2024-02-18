const Cliente = require("../db/models/cliente.model");
const bcrypt = require('bcrypt');

// Controlador para obtener todos los clientes
async function getAllClientes(req, res) {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los clientes" });
  }
}

// Controlador para crear un nuevo cliente
async function createCliente(req, res) {
  const {
    vchNomCliente,
    vchAPaterno,
    vchAMaterno,
    vchCorreo,
    chrSexo,
    dtFechaNacimiento,
    vchTelefono,
    vchPassword,
    Calle,
    intIdColonia,
    vchPreguntaSecreta,
  vchRespuestaSecreta // Agregar las nuevas columnas aquí
  } = req.body;
  try {

    const hashedPassword = await bcrypt.hash(vchPassword, 10);

    const nuevoCliente = await Cliente.create({
      vchNomCliente,
      vchAPaterno,
      vchAMaterno,
      vchCorreo,
      chrSexo,
      dtFechaNacimiento,
      vchTelefono,
      vchPassword: hashedPassword,
      Calle,
      intIdColonia,
      vchPreguntaSecreta,
      vchRespuestaSecreta // Agregar las nuevas columnas aquí
    });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el cliente" });
  }
}

module.exports = {
  getAllClientes,
  createCliente,
};
