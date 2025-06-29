const Empleado = require("../db/models/CrearEmpleado.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Controlador para obtener todos los clientes
async function getAllEmpleado(req, res) {
  try {
    const empleados = await Empleado.findAll();
    res.json(empleados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los empleados" });
  }
}

async function createEmpleado(req, res) {
  const {
    vchNombre,
    vchAPaterno,
    vchAMaterno,
    vchCorreo,
    dtFechaNacimiento,
    vchLugarNacimiento,
    vchTelefono,
    chrSexo,
    EstadoEmp,
    TipoEmp,
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
      vchLugarNacimiento,
      vchTelefono,
      chrSexo,
      EstadoEmp,
      TipoEmp,
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
    const empleado = await Empleado.findOne({ where: { vchCorreo } });

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // Verificar que el empleado esté aceptado
    if (empleado.EstadoEmp !== "Aceptado") {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Tu cuenta no está autorizada para iniciar sesión en este momento." });
    }

    const validPassword = await bcrypt.compare(
      vchPassword,
      empleado.vchPassword
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        empleadoId: empleado.intClvEmpleado,
        nombre: empleado.vchNombre,
        apellidoPaterno: empleado.vchAPaterno,
        apellidoMaterno: empleado.vchAMaterno,
        userType: "empleado",
      },
      "secreto",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor para empleado" });
  }
}

async function updateEmpleado(req, res) {
  const { id } = req.params;
  const {
    vchNombre,
    vchAPaterno,
    vchAMaterno,
    vchCorreo,
    dtFechaNacimiento,
    vchLugarNacimiento,
    vchTelefono,
    chrSexo,
    EstadoEmp,
    TipoEmp,
    vchPreguntaSecreta,
    vchRespuestaSecreta,
  } = req.body;

  try {
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    empleado.set({
      vchNombre,
      vchAPaterno,
      vchAMaterno,
      vchCorreo,
      dtFechaNacimiento,
      vchLugarNacimiento,
      vchTelefono,
      chrSexo,
      EstadoEmp,
      TipoEmp,
      vchPreguntaSecreta,
      vchRespuestaSecreta,
    });

    await empleado.save();

    res.json({ message: "Empleado actualizado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el empleado" });
  }
}

async function getEmpleadoById(req, res) {
  const { id } = req.params;

  try {
    const empleado = await Empleado.findOne({ where: { intClvEmpleado: id } });

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.json(empleado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el empleado" });
  }
}

async function deactivateEmpleado(req, res) {
  const { id } = req.params;

  try {
    const [updated] = await Empleado.update(
      { EstadoEmp: "Desactivado" },
      { where: { intClvEmpleado: id } }
    );

    if (updated) {
      res.status(200).json({ message: "Empleado dado de baja con éxito" });
    } else {
      res.status(404).json({ message: "Empleado no encontrado" });
    }
  } catch (error) {
    console.error("Error al dar de baja al empleado:", error);
    res.status(500).json({ message: "Error al dar de baja al empleado" });
  }
}

module.exports = {
  getEmpleadoById,
  deactivateEmpleado,
  getAllEmpleado,
  updateEmpleado,
  createEmpleado,
  loginEmpleado,
};