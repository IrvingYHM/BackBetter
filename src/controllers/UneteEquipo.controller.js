const UneteEquipo = require("../db/models/UneteEquipo.model");
const fs = require("fs-extra");

const cloudinary = require('../services/cloudinari')

const createUneteEquipo = async (req, res) => {
  try {
    const { Titulo, Subtitulo, Beneficios, TextoBoton } = req.body;

    let imageUrl = null;
    let publicId = null;

    if (req.files && req.files.Imagen) {
      const file = req.files.Imagen;
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      imageUrl = result.secure_url;
      publicId = result.public_id;
      await fs.unlink(file.tempFilePath);
    }

    const nuevo = await UneteEquipo.create({
      Titulo,
      Subtitulo,
      Beneficios: JSON.stringify(Beneficios),
      TextoBoton,
      Imagen: imageUrl,
      PublicId: publicId,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUneteEquipo = async (req, res) => {
  try {
    const data = await UneteEquipo.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUneteEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await UneteEquipo.findByPk(id);

    if (!registro) return res.status(404).json({ message: "No encontrado" });

    const { Titulo, Subtitulo, Beneficios, TextoBoton } = req.body;
    let imageUrl = registro.Imagen;
    let publicId = registro.PublicId;

    if (req.files && req.files.Imagen) {
      if (publicId) await cloudinary.uploader.destroy(publicId);
      const file = req.files.Imagen;
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      imageUrl = result.secure_url;
      publicId = result.public_id;
      await fs.unlink(file.tempFilePath);
    }

    await registro.update({
      Titulo,
      Subtitulo,
      Beneficios: JSON.stringify(Beneficios),
      TextoBoton,
      Imagen: imageUrl,
      PublicId: publicId,
    });

    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUneteEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await UneteEquipo.findByPk(id);

    if (!registro) return res.status(404).json({ message: "No encontrado" });

    if (registro.PublicId) await cloudinary.uploader.destroy(registro.PublicId);

    await registro.destroy();
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUneteEquipo,
  getUneteEquipo,
  updateUneteEquipo,
  deleteUneteEquipo,
};
