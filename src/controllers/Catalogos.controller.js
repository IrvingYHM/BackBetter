const Catalogos = require("../db/models/catalogos.model");
const cloudinary = require('../services/cloudinari');

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

    // Validar que la URL sea válida
    try {
      new URL(vchCatalogo);
    } catch (error) {
      return res.status(400).json({ message: "La URL del catálogo no es válida." });
    }

    // Manejar imagen de portada (opcional)
    let imagenPortadaUrl = null;
    if (req.files && req.files.imagenPortada) {
      const imagenFile = req.files.imagenPortada;
      
      // Validar que sea una imagen
      if (!imagenFile.mimetype.startsWith('image/')) {
        return res
          .status(400)
          .json({ message: "El archivo de portada debe ser una imagen." });
      }

      // Validar tamaño de imagen (máximo 5MB)
      if (imagenFile.size > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "La imagen de portada no debe superar los 5MB." });
      }

      // Subir imagen a Cloudinary
      const result = await cloudinary.uploader.upload(imagenFile.tempFilePath, {
        folder: "Catalogos",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto:good" }
        ]
      });
      imagenPortadaUrl = result.url;
    }

    const nuevoCatalogo = await Catalogos.create({
      vchNombreCatalogo,
      vchCatalogo,
      imagenPortada: imagenPortadaUrl,
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

    // Validar URL si se proporciona una nueva
    if (vchCatalogo) {
      try {
        new URL(vchCatalogo);
      } catch (error) {
        return res.status(400).json({ message: "La URL del catálogo no es válida." });
      }
    }

    // Actualizar imagen de portada si se proporciona una nueva
    let nuevaImagenPortada = catalogo.imagenPortada;
    if (req.files && req.files.imagenPortada) {
      const imagenFile = req.files.imagenPortada;
      
      // Validar que sea una imagen
      if (!imagenFile.mimetype.startsWith('image/')) {
        return res
          .status(400)
          .json({ message: "El archivo de portada debe ser una imagen." });
      }

      // Validar tamaño de imagen (máximo 5MB)
      if (imagenFile.size > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "La imagen de portada no debe superar los 5MB." });
      }

      // Subir nueva imagen a Cloudinary
      const result = await cloudinary.uploader.upload(imagenFile.tempFilePath, {
        folder: "Catalogos",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto:good" }
        ]
      });
      nuevaImagenPortada = result.url;
    }

    catalogo.vchNombreCatalogo = vchNombreCatalogo || catalogo.vchNombreCatalogo;
    catalogo.vchCatalogo = vchCatalogo || catalogo.vchCatalogo;
    catalogo.imagenPortada = nuevaImagenPortada;

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

    // Eliminar imagen de portada de Cloudinary si existe
    if (catalogo.imagenPortada) {
      try {
        // Extraer el public_id de la URL de Cloudinary
        const urlParts = catalogo.imagenPortada.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `Catalogos/${filename.split('.')[0]}`;
        
        // Eliminar imagen de Cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error al eliminar imagen de Cloudinary:", cloudinaryError);
        // Continuar con la eliminación del catálogo aunque falle la eliminación de la imagen
      }
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
