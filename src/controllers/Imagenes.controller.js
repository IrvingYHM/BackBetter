const Imagenes = require("../db/models/Imagenes.model");
const cloudinary = require("../services/cloudinari");
const fs = require("fs");

// Crear imagen (slider, reto o ganadores)
const createImagen = async (req, res) => {
  try {
    const { tipo, UrlDestino } = req.body;

    if (!req.files || !req.files.imagen) {
      return res
        .status(400)
        .json({ message: "No se ha seleccionado ninguna imagen." });
    }

    const file = req.files.imagen;

    if (!file.mimetype.startsWith("image/")) {
      return res
        .status(400)
        .json({ message: "Solo se permiten archivos de imagen." });
    }

    const tempPath = file.tempFilePath || `./uploads/${file.name}`;
    await file.mv(tempPath);

    const result = await cloudinary.uploader.upload(tempPath, {
      folder: `Imagenes/${tipo}`,
    });

    fs.unlinkSync(tempPath);

    const nuevaImagen = await Imagenes.create({
      Imagen: result.secure_url,
      UrlDestino: UrlDestino || null,
      public_id: result.public_id,
      tipo,
    });

    res
      .status(201)
      .json({ message: "Imagen creada con éxito", imagen: nuevaImagen });
  } catch (error) {
    console.error("Error al crear la imagen:", error);
    res.status(500).json({ message: "Error interno al crear la imagen." });
  }
};

// Obtener imágenes por tipo
const getImagenesByTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const imagenes = await Imagenes.findAll({ where: { tipo } });
    res.json(imagenes);
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    res.status(500).json({ message: "Error al obtener imágenes." });
  }
};

// Actualizar imagen
const updateImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, UrlDestino } = req.body;

    const imagen = await Imagenes.findByPk(id);
    if (!imagen) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    let nuevaUrl = imagen.Imagen;
    let nuevoPublicId = imagen.public_id;

    // Si se sube una nueva imagen
    if (req.files && req.files.imagen) {
      const file = req.files.imagen;

      if (!file.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ message: "Solo se permiten archivos de imagen." });
      }

      const tempPath = file.tempFilePath || `./uploads/${file.name}`;
      await file.mv(tempPath);

      // Eliminar imagen anterior en Cloudinary
      await cloudinary.uploader.destroy(imagen.public_id);

      const result = await cloudinary.uploader.upload(tempPath, {
        folder: `Imagenes/${tipo || imagen.tipo}`,
      });

      fs.unlinkSync(tempPath);
      nuevaUrl = result.secure_url;
      nuevoPublicId = result.public_id;
    }

    // Actualiza los campos
    imagen.Imagen = nuevaUrl;
    imagen.public_id = nuevoPublicId;
    imagen.UrlDestino = UrlDestino || null;
    imagen.tipo = tipo || imagen.tipo;

    await imagen.save();

    res.json({ message: "Imagen actualizada con éxito", imagen });
  } catch (error) {
    console.error("Error al actualizar la imagen:", error);
    res.status(500).json({ message: "Error al actualizar la imagen." });
  }
};

// Eliminar imagen
const deleteImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const imagen = await Imagenes.findByPk(id);

    if (!imagen) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    await cloudinary.uploader.destroy(imagen.public_id);
    await imagen.destroy();

    res.json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({ message: "Error al eliminar la imagen." });
  }
};

module.exports = {
  createImagen,
  getImagenesByTipo,
  updateImagen,
  deleteImagen,
};
