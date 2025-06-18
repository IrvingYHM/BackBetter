const TopReferidos = require("../db/models/TopReferidos.model");
const Empleado = require("../db/models/CrearEmpleado.model");

// Obtener el top 10 de Referidos por mes y año
async function getTopReferidos(req, res) {
  const { mes, año } = req.query;
  try {
    const top = await TopReferidos.findAll({
      where: { mes, año },
      include: [
        {
          model: Empleado,
          as: "empleado",
          attributes: ["vchNombre", "vchAPaterno", "vchAMaterno"],
        },
      ],
      order: [["numReferidos", "DESC"]],
      limit: 10,
    });
    res.json(top);
  } catch (error) {
    console.error("Error al obtener el top de Referidos:", error);
    res.status(500).json({ message: "Error al obtener el top de Referidos" });
  }
}

// Crear nuevo registro en top Referidos
async function createTopReferidos(req, res) {
  const { intClvEmpleado, mes, año, numReferidos } = req.body;
  try {
    const nuevoRegistro = await TopReferidos.create({
      intClvEmpleado,
      mes,
      año,
      numReferidos,
    });
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    console.error("Error al crear registro:", error);
    res
      .status(500)
      .json({ message: "Error al crear el registro de top Referidos" });
  }
}

// Actualizar registro (por ID)
async function updateTopReferidos(req, res) {
  const { id } = req.params;
  const { intClvEmpleado, mes, año, numReferidos } = req.body;
  try {
    const top = await TopReferidos.findByPk(id);
    if (!top)
      return res.status(404).json({ message: "Registro no encontrado" });

    top.intClvEmpleado = intClvEmpleado;
    top.mes = mes;
    top.año = año;
    top.numReferidos = numReferidos;

    await top.save();
    res.json({ message: "Registro actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: "Error al actualizar el registro" });
  }
}

// Eliminar registro
async function deleteTopReferidos(req, res) {
  const { id } = req.params;
  try {
    const deleted = await TopReferidos.destroy({ where: { idTopReferidos: id } });
    if (!deleted)
      return res.status(404).json({ message: "Registro no encontrado" });
    res.json({ message: "Registro eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ message: "Error al eliminar el registro" });
  }
}

module.exports = {
  getTopReferidos,
  createTopReferidos,
  updateTopReferidos,
  deleteTopReferidos,
};
