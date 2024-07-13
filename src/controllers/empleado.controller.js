const Empleado = require("../db/models/CrearEmpleado.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Controlador para obtener todos los clientes
async function getAllEmpleado(req, res) {
  try {
    const empleado = await Empleado.findAll();
    res.json(empleado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los empleado" });
  }
}

async function createEmpleado(req, res) {
  const {
    vchNombre,
    vchAPaterno,
    vchAMaterno,
    vchCorreo,
    dtFechaNacimiento,
    vchTelefono,
    chrSexo,
    EstadoEmp,
    vchPassword,
    vchPreguntaSecreta,
    vchRespuestaSecreta, 
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(vchPassword, 10);

    const nuevoEmpleado = await Empleado.create({
      vchNombre,
      vchAPaterno,
      vchAMaterno,
      vchCorreo,
      dtFechaNacimiento,
      vchTelefono,
      chrSexo,
      EstadoEmp,
      vchPassword: hashedPassword,
      vchPreguntaSecreta,
      vchRespuestaSecreta, 

    });
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el empleado" });
  }
}

async function loginEmpleado(req, res) {
  const { vchCorreo, vchPassword } = req.body;
  try {
    // Buscar al cliente por correo electrónico en la base de datos
    const empleado = await Empleado.findOne({ where: { vchCorreo } });

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const validPassword = await bcrypt.compare(
      vchPassword,
      empleado.vchPassword
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    // Generar un token de autenticación
    const token = jwt.sign(
      {
        empleadoId: empleado.intClvEmpleado,
        nombre: empleado.vchNombre,
        apellidoPaterno: empleado.vchAPaterno,
        apellidoMaterno: empleado.vchAMaterno,
        userType: "empleado", // Agregar el userType aquí xd
      },
      "secreto",
      { expiresIn: "1h" }
    );
    console.log(token);

    // Enviar el token como respuesta
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor para empleado" });
  }
}


async function actualizarEmpleado(req,res){
  const { id } = req.params;
  const {
    vchNombre,
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
    cliente.vchNombre = vchNombre;
    cliente.vchAPaterno = vchAPaterno;
    cliente.vchAMaterno = vchAMaterno;
    cliente.vchCorreo = vchCorreo;
    cliente.vchTelefono = vchTelefono;
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
  getAllEmpleado,
  createEmpleado,
  loginEmpleado,
};
