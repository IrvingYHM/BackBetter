const { Client } = require("pg");
const Cliente = require("../db/models/cliente.model");
const bcrypt = require('bcryptjs');
const Log = require("../db/models/log/log.model")
const requestIp = require('request-ip');


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

    // Registro en el log
    const ip = requestIp.getClientIp(req);
    await Log.create({
      ip: ip,
      url: req.originalUrl,
      codigo_estado: 201,
      fecha_hora: new Date(),
      id_cliente: nuevoCliente.intClvCliente, // Usar el ID del nuevo cliente
      Accion: "Creación de nuevo cliente"
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el cliente" });
  }
}


// Controlador traer un cliente por su id

async function getClientePorId(req,res){
  const { id } = req.params;

  try {
    const cliente = await Cliente.findByPk(id);
    if(!cliente){
      return res.status(404).json({message: "Cliente no encontraddo"});
    }
    res.json(cliente);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Error al obtener el cliente"});
  }

}


// Controlador para actualizar los datos de un cliente existente
async function updateCliente(req, res) {
  const { id } = req.params;
  const {
    vchNomCliente,
    vchAPaterno,
    vchAMaterno,
    vchCorreo,
    vchTelefono,
    // Nueva contraseña
/*     vchPassword, */
    // Pregunta y respuesta secretas
/*     vchPreguntaSecreta,
    vchRespuestaSecreta */
  } = req.body;

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Actualizar los datos del cliente
    cliente.vchNomCliente = vchNomCliente;
    cliente.vchAPaterno = vchAPaterno;
    cliente.vchAMaterno = vchAMaterno;
    cliente.vchCorreo = vchCorreo;
    cliente.vchTelefono = vchTelefono;

    // Registro en el log
    const ip = requestIp.getClientIp(req);
    await Log.create({
      ip: ip,
      url: req.originalUrl,
      codigo_estado: 200,
      fecha_hora: new Date(),
      id_cliente: id, // Usar el ID del cliente
      Accion: "Actualización de datos del cliente"
    });

    // Actualizar la contraseña si se proporciona una nueva
/*     if (vchPassword) {
      cliente.vchPassword = await bcrypt.hash(vchPassword, 10);
    } */

    // Actualizar la pregunta y respuesta secretas
/*     cliente.vchPreguntaSecreta = vchPreguntaSecreta;
    cliente.vchRespuestaSecreta = vchRespuestaSecreta;
 */
    await cliente.save();

    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el cliente" });
  }
}



module.exports = {
  getAllClientes,
  createCliente,
  getClientePorId,
  updateCliente
};


