const Empleado = require("../db/models/CrearEmpleado.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Controlador para crear un nuevo cliente
async function createEmpleado(req, res) {
  const {
    vchNombre,
    vchAPaterno,
    vchAMaterno,
    vchCorreo,
    dtFechaNacimiento,
    vchTelefono,
    chrSexo,
    enEstado,
    vchPassword,
    vchPreguntaSecreta,
    vchRespuestaSecreta, // Agregar las nuevas columnas aquí,
    Calle,
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
        enEstado,
        vchPassword: hashedPassword,
        vchPreguntaSecreta,
        vchRespuestaSecreta, // Agregar las nuevas columnas aquí
        Calle,
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
        
        // Si no se encuentra el cliente, enviar un mensaje de error
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        
        // Verificar la contraseña
        const validPassword = await bcrypt.compare(vchPassword, empleado.vchPassword);
        
        // Si la contraseña no es válida, enviar un mensaje de error
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }        
        // Generar un token de autenticación
        const token = jwt.sign({ 
            empleadoId: empleado.intClvEmpleado,
            nombre: empleado.vchNombre,
            apellidoPaterno: empleado.vchAPaterno,
            apellidoMaterno: empleado.vchAMaterno,
            userType: 'empleado' // Agregar el userType aquí xd

        }, 'secreto', { expiresIn: '1h' });
        console.log(token)
        
        // Enviar el token como respuesta
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor para empleado' });
    }
}


module.exports = {
    getAllEmpleado,
    createEmpleado,
    loginEmpleado,
};
