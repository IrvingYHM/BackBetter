const Catalogos = require("../db/models/catalogos.model");

const getCatalogos = async (req, res) => {
  try {
    const catalogos = await Catalogos.findAll();
    res.json(catalogos);
  } catch (error) {
    console.error("Error al obtener los catálogos:", error);
    res.status(500).json({ message: "Error al obtener los catálogos." });
  }
};

const createCatalogo = async (req, res) => {
  try {
    const { vchNombreCatalogo, vchCatalogo } = req.body;

    if (!vchCatalogo || !vchNombreCatalogo) {
      return res.status(400).json({ message: "Nombre y URL del catálogo son requeridos." });
    }

    const nuevoCatalogo = await Catalogos.create({
      vchNombreCatalogo,
      vchCatalogo,
    });

    res.status(201).json({
      message: "Catálogo creado correctamente",
      catalogo: nuevoCatalogo,
    });
  } catch (error) {
    console.error("Error al crear el catálogo:", error);
    res.status(500).json({ message: "Error interno al crear el catálogo." });
  }
};

const updateCatalogo = async (req, res) => {
  try {
    const { id } = req.params;
    const { vchNombreCatalogo, vchCatalogo } = req.body;

    const catalogo = await Catalogos.findByPk(id);

    if (!catalogo) {
      return res.status(404).json({ message: "Catálogo no encontrado" });
    }

    catalogo.vchNombreCatalogo = vchNombreCatalogo || catalogo.vchNombreCatalogo;
    catalogo.vchCatalogo = vchCatalogo || catalogo.vchCatalogo;

    await catalogo.save();

    res.json({
      message: "Catálogo actualizado correctamente",
      catalogo,
    });
  } catch (error) {
    console.error("Error al actualizar el catálogo:", error);
    res.status(500).json({ message: "Error al actualizar el catálogo." });
  }
};

const deleteCatalogo = async (req, res) => {
  try {
    const { id } = req.params;

    const catalogo = await Catalogos.findByPk(id);

    if (!catalogo) {
      return res.status(404).json({ message: "Catálogo no encontrado" });
    }

    await catalogo.destroy();

    res.json({ message: "Catálogo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el catálogo:", error);
    res.status(500).json({ message: "Error al eliminar el catálogo." });
  }
};

module.exports = {
  createCatalogo,
  updateCatalogo,
  deleteCatalogo,
  getCatalogos,
};
