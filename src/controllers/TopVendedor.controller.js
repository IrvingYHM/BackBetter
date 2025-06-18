const TopVendedor = require("../db/models/TopVendedor.model");
const Empleado = require("../db/models/CrearEmpleado.model");

// Obtener el top 10 de vendedores por mes y año
async function getTopVendedores(req, res) {
  const { mes, año } = req.query;
  try {
    const top = await TopVendedor.findAll({
      where: { mes, año },
      include: [
        {
          model: Empleado,
          as: "empleado",
          attributes: ["vchNombre", "vchAPaterno", "vchAMaterno"],
        },
      ],
      order: [["numVentas", "DESC"]],
      limit: 10,
    });
    res.json(top);
  } catch (error) {
    console.error("Error al obtener el top de vendedores:", error);
    res.status(500).json({ message: "Error al obtener el top de vendedores" });
  }
}

// Crear nuevo registro en top vendedores
async function createTopVendedor(req, res) {
  const { intClvEmpleado, mes, año, numVentas } = req.body;
  try {
    const nuevoRegistro = await TopVendedor.create({
      intClvEmpleado,
      mes,
      año,
      numVentas,
    });
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    console.error("Error al crear registro:", error);
    res
      .status(500)
      .json({ message: "Error al crear el registro de top vendedor" });
  }
}

// Actualizar registro (por ID)
async function updateTopVendedor(req, res) {
  const { id } = req.params;
  const { intClvEmpleado, mes, año, numVentas } = req.body;
  try {
    const top = await TopVendedor.findByPk(id);
    if (!top)
      return res.status(404).json({ message: "Registro no encontrado" });

    top.intClvEmpleado = intClvEmpleado;
    top.mes = mes;
    top.año = año;
    top.numVentas = numVentas;

    await top.save();
    res.json({ message: "Registro actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: "Error al actualizar el registro" });
  }
}

// Eliminar registro
async function deleteTopVendedor(req, res) {
  const { id } = req.params;
  try {
    const deleted = await TopVendedor.destroy({ where: { idTopVendedor: id } });
    if (!deleted)
      return res.status(404).json({ message: "Registro no encontrado" });
    res.json({ message: "Registro eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ message: "Error al eliminar el registro" });
  }
}

module.exports = {
  getTopVendedores,
  createTopVendedor,
  updateTopVendedor,
  deleteTopVendedor,
};
