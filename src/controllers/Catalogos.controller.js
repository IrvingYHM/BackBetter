const Catalogos = require("../db/models/catalogos.model"); // Ajusta la ruta si es diferente
const { uploadPDFToDrive, deleteFile } = require("../services/googleDrive");
const fs = require("fs");

// ID de la carpeta de Google Drive donde se subirán los catálogos
const FOLDER_ID = '1jPEg73smmQcsM9aMdf0HHnryK7flwlIe';

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

    if (file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ message: "Solo se permiten archivos PDF." });
    }

    const tempPath = file.tempFilePath || `./uploads/${file.name}`;
    await file.mv(tempPath);

    const uploadResult = await uploadPDFToDrive(tempPath, file.name, FOLDER_ID);

    fs.unlinkSync(tempPath); // elimina archivo temporal

    const nuevoCatalogo = await Catalogos.create({
      vchNombreCatalogo,
      vchCatalogo: uploadResult.webViewLink,
      fileId: uploadResult.fileId,
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
    const { vchNombreCatalogo } = req.body;

    const catalogo = await Catalogos.findByPk(id);

    if (!catalogo) {
      return res.status(404).json({ message: "Catálogo no encontrado" });
    }

    let nuevaUrl = catalogo.vchCatalogo;
    let nuevoFileId = catalogo.fileId;

    if (req.files && req.files.catalogo) {
      const file = req.files.catalogo;

      if (file.mimetype !== "application/pdf") {
        return res
          .status(400)
          .json({ message: "Solo se permiten archivos PDF." });
      }

      const tempPath = file.tempFilePath || `./uploads/${file.name}`;
      await file.mv(tempPath);

      // Eliminar el archivo anterior de Google Drive
      if (catalogo.fileId) {
        await deleteFile(catalogo.fileId);
      }

      const uploadResult = await uploadPDFToDrive(
        tempPath,
        file.name,
        FOLDER_ID
      );

      fs.unlinkSync(tempPath);

      nuevaUrl = uploadResult.webViewLink;
      nuevoFileId = uploadResult.fileId;
    }

    catalogo.vchNombreCatalogo =
      vchNombreCatalogo || catalogo.vchNombreCatalogo;
    catalogo.vchCatalogo = nuevaUrl;
    catalogo.fileId = nuevoFileId;

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

    if (catalogo.fileId) {
      await deleteFile(catalogo.fileId);
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
