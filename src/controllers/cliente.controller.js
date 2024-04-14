const Cliente = require("../db/models/cliente.model");
const bcrypt = require('bcryptjs');


// Controlador para obtener todos los clientes o filtrar por correo electrónico
async function getAllClientes(req, res) {
  const { email } = req.query; // Obtener el parámetro de consulta de correo electrónico

  try {
    let clientes;
    if (email) {
      // Si se proporciona un correo electrónico, buscar el cliente por ese correo electrónico
      clientes = await Cliente.findOne({ where: { vchCorreo: email } });
    } else {
      // De lo contrario, obtener todos los clientes
      clientes = await Cliente.findAll();
    }
    
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
    vchPreguntaSecreta,
    vchRespuestaSecreta, 
  } = req.body;
  try {
    console.log("Contraseña recibida:", vchPassword); // Agregar este log para verificar la contraseña recibida

    if (typeof vchPassword !== 'string' || !vchPassword.trim()) {
      throw new Error('La contraseña es inválida');
      
    }

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
      vchPreguntaSecreta,
      vchRespuestaSecreta, 
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


