const Catalogos = require("../db/models/catalogos.model"); // Ajusta la ruta si es diferente
const cloudinary = require("../services/cloudinari"); // Asegúrate de tener este servicio configurado

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
    const { vchNombreCatalogo } = req.body;

    if (!req.files || !req.files.catalogo) {
      return res
        .status(400)
        .json({ message: "No se ha seleccionado ningún archivo PDF." });
    }

    const file = req.files.catalogo;

    // Validar que sea un archivo PDF
    if (file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ message: "Solo se permiten archivos PDF." });
    }

    // Subir el PDF a Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "Catalogos",
      resource_type: "raw", // Importante para subir archivos no imagen
    });

    // Crear registro en la base de datos
    const nuevoCatalogo = await Catalogos.create({
      vchNombreCatalogo,
      vchCatalogo: result.secure_url,
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

const extractPublicId = (url) => {
  // Ejemplo: https://res.cloudinary.com/demo/raw/upload/v1717887654/Catalogos/catalogo1.pdf
  const parts = url.split("/");
  const fileName = parts.pop().split(".")[0]; // "catalogo1"
  const folder = parts.slice(parts.indexOf("upload") + 1).join("/"); // "Catalogos"
  return `${folder}/${fileName}`; // "Catalogos/catalogo1"
};

const updateCatalogo = async (req, res) => {
  try {
    const { id } = req.params;
    const { vchNombreCatalogo } = req.body;

    const catalogo = await Catalogos.findByPk(id);

    if (!catalogo) {
      return res.status(404).json({ message: "Catálogo no encontrado" });
    }

    let nuevaUrl = catalogo.vchCatalogo;

    if (req.files && req.files.catalogo) {
      const file = req.files.catalogo;

      if (file.mimetype !== "application/pdf") {
        return res
          .status(400)
          .json({ message: "Solo se permiten archivos PDF." });
      }

      // Eliminar archivo anterior de Cloudinary
      const publicId = extractPublicId(catalogo.vchCatalogo);
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

      // Subir nuevo archivo
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "Catalogos",
        resource_type: "raw",
      });

      nuevaUrl = result.secure_url;
    }

    catalogo.vchNombreCatalogo =
      vchNombreCatalogo || catalogo.vchNombreCatalogo;
    catalogo.vchCatalogo = nuevaUrl;

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

    // Eliminar archivo del Cloudinary
    const publicId = extractPublicId(catalogo.vchCatalogo);
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

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
