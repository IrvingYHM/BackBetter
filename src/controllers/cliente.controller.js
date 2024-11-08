const { Client } = require("pg");
const Cliente = require("../db/models/cliente.model");
const bcrypt = require('bcryptjs');
const Log = require("../db/models/log/log.model")
const requestIp = require('request-ip');
const DireccionCliente = require("../db/models/Direc_Client.model");

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


// Función para generar un número aleatorio de 4 dígitos
function generateRandomIdentifier() {
  return Math.floor(1000 + Math.random() * 9000); // Genera un número aleatorio entre 1000 y 9999
}

// Función para verificar si un código ya existe en la base de datos
async function isUniqueCode(code) {
  const cliente = await Cliente.findOne({ where: { codigoAle: code } });
  return cliente === null;
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

    // Generar un código aleatorio único
    let codigoAle;
    do {
      codigoAle = generateRandomIdentifier();
    } while (!(await isUniqueCode(codigoAle)));

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
      codigoAle,
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
    foto,
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
    cliente.foto = foto;

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


// Controlador para buscar un cliente por codigoAle
async function findClienteByCodigoAle(req, res) {
  const { codigoAle } = req.params;
  try {
    const cliente = await Cliente.findOne({ where: { codigoAle: codigoAle } });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar el cliente" });
  }
}

// Controlador para obtener la dirección de un cliente por su IdCliente
async function getDireccionClientePorId(req, res) {
  const { IdCliente } = req.params;
  try {
    const direccionCliente = await DireccionCliente.findOne({
      where: { IdCliente },
    });
    if (direccionCliente) {
      res.json(direccionCliente);
    } else {
      res.status(404).json({ message: "Dirección no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la dirección del cliente" });
  }
}

// Controlador para actualizar la dirección de un cliente por su IdCliente
async function updateDireccionCliente(req, res) {
  const { IdCliente } = req.params;
  const { calle, numero, ciudad, estado, codigoPostal } = req.body; // Asegúrate de ajustar estos campos a tu modelo

  try {
    const direccionCliente = await DireccionCliente.findOne({
      where: { IdCliente },
    });

    if (direccionCliente) {
      direccionCliente.calle = calle;
      direccionCliente.numero = numero;
      direccionCliente.ciudad = ciudad;
      direccionCliente.estado = estado;
      direccionCliente.codigoPostal = codigoPostal;

      await direccionCliente.save();

      res.json(direccionCliente);
    } else {
      res.status(404).json({ message: "Dirección no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la dirección del cliente" });
  }
}


// Controlador para verificar la contraseña actual del cliente
async function verifyPassword(req, res) {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Comparar la contraseña proporcionada con el hash almacenado
    const isMatch = await bcrypt.compare(password, cliente.vchPassword);
    if (isMatch) {
      res.status(200).json({ message: "Contraseña correcta" });
    } else {
      res.status(400).json({ message: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al verificar la contraseña" });
  }
}

// Controlador para cambiar la contraseña del cliente
async function changePassword(req, res) {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    // Buscar el cliente en la base de datos
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Actualizar la contraseña con el nuevo valor
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    cliente.vchPassword = hashedNewPassword;
    await cliente.save();

    res.status(200).json({ message: "Contraseña cambiada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
}





module.exports = {
  getAllClientes,
  createCliente,
  getClientePorId,
  updateCliente,
  findClienteByCodigoAle,
  getDireccionClientePorId,
  updateDireccionCliente,
  verifyPassword,
  changePassword
};


