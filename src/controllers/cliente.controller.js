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

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Si hay un archivo de foto, procesarlo con Cloudinary
    if (req.files && req.files.foto) {
      const file = req.files.foto;

      // Validar que sea una imagen
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Solo se permiten archivos de imagen." });
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: "La imagen no puede superar los 5MB." });
      }

      const fs = require("fs");
      const cloudinary = require("../services/cloudinari");

      const tempPath = file.tempFilePath || `./uploads/${file.name}`;
      await file.mv(tempPath);

      // Eliminar foto anterior si existe
      if (cliente.foto && cliente.public_id_foto) {
        try {
          await cloudinary.uploader.destroy(cliente.public_id_foto);
        } catch (error) {
          console.log("Error eliminando foto anterior:", error);
        }
      }

      // Subir nueva foto a Cloudinary
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: "Perfil/Clientes",
        transformation: [
          { width: 400, height: 400, crop: "fill" },
          { quality: "auto" },
          { format: "auto" }
        ]
      });

      // Eliminar archivo temporal
      fs.unlinkSync(tempPath);

      // Actualizar datos de la foto
      cliente.foto = result.secure_url;
      cliente.public_id_foto = result.public_id;

      // Registro en el log para foto
      const ip = requestIp.getClientIp(req);
      await Log.create({
        ip: ip,
        url: req.originalUrl,
        codigo_estado: 200,
        fecha_hora: new Date(),
        id_cliente: id,
        Accion: "Actualización de foto de perfil"
      });

      await cliente.save();

      return res.json({
        message: "Foto de perfil actualizada con éxito",
        foto: result.secure_url,
        cliente: {
          intClvCliente: cliente.intClvCliente,
          vchNomCliente: cliente.vchNomCliente,
          vchAPaterno: cliente.vchAPaterno,
          foto: cliente.foto
        }
      });
    }

    // Si no hay archivo, actualizar solo los datos del formulario
    const {
      vchNomCliente,
      vchAPaterno,
      vchAMaterno,
      vchCorreo,
      vchTelefono,
      foto,
    } = req.body;

    if (vchNomCliente !== undefined) cliente.vchNomCliente = vchNomCliente;
    if (vchAPaterno !== undefined) cliente.vchAPaterno = vchAPaterno;
    if (vchAMaterno !== undefined) cliente.vchAMaterno = vchAMaterno;
    if (vchCorreo !== undefined) cliente.vchCorreo = vchCorreo;
    if (vchTelefono !== undefined) cliente.vchTelefono = vchTelefono;
    if (foto !== undefined) cliente.foto = foto;

    // Registro en el log
    const ip = requestIp.getClientIp(req);
    await Log.create({
      ip: ip,
      url: req.originalUrl,
      codigo_estado: 200,
      fecha_hora: new Date(),
      id_cliente: id,
      Accion: "Actualización de datos del cliente"
    });

    await cliente.save();
    res.json(cliente);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
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
  const { Estado, CP, Municipio, Colonia, Calle, NumExt, NumInt, Referencia } = req.body;

  try {
    const direccionCliente = await DireccionCliente.findOne({
      where: { IdCliente },
    });

    if (direccionCliente) {
      // Update using the correct field names from the model
      await direccionCliente.update({
        Estado,
        CP,
        Municipio,
        Colonia,
        Calle,
        NumExt,
        NumInt,
        Referencia
      });

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





// Controlador para subir foto de perfil
async function uploadProfilePhoto(req, res) {
  const { id } = req.params;
  
  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    if (!req.files || !req.files.foto) {
      return res.status(400).json({ message: "No se ha seleccionado ninguna imagen." });
    }

    const file = req.files.foto;

    // Validar que sea una imagen
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Solo se permiten archivos de imagen." });
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "La imagen no puede superar los 5MB." });
    }

    const fs = require("fs");
    const cloudinary = require("../services/cloudinari");

    const tempPath = file.tempFilePath || `./uploads/${file.name}`;
    await file.mv(tempPath);

    // Eliminar foto anterior si existe
    if (cliente.foto && cliente.public_id_foto) {
      try {
        await cloudinary.uploader.destroy(cliente.public_id_foto);
      } catch (error) {
        console.log("Error eliminando foto anterior:", error);
      }
    }

    // Subir nueva foto a Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "Perfil/Clientes",
      transformation: [
        { width: 400, height: 400, crop: "fill" }, // Redimensionar y recortar
        { quality: "auto" }, // Optimizar calidad
        { format: "auto" } // Formato automático
      ]
    });

    // Eliminar archivo temporal
    fs.unlinkSync(tempPath);

    // Actualizar cliente con nueva foto
    cliente.foto = result.secure_url;
    cliente.public_id_foto = result.public_id; // Guardar public_id para poder eliminar después
    await cliente.save();

    // Registro en el log
    const ip = requestIp.getClientIp(req);
    await Log.create({
      ip: ip,
      url: req.originalUrl,
      codigo_estado: 200,
      fecha_hora: new Date(),
      id_cliente: id,
      Accion: "Actualización de foto de perfil"
    });

    res.json({ 
      message: "Foto de perfil actualizada con éxito", 
      foto: result.secure_url,
      cliente: {
        intClvCliente: cliente.intClvCliente,
        vchNomCliente: cliente.vchNomCliente,
        vchAPaterno: cliente.vchAPaterno,
        foto: cliente.foto
      }
    });
  } catch (error) {
    console.error("Error al subir foto de perfil:", error);
    res.status(500).json({ message: "Error interno al subir la foto de perfil." });
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
  changePassword,
  uploadProfilePhoto
};


