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

module.exports = {
    getAllDirec_Empleado
}