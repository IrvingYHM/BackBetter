const UneteEquipo = require("../models/UneteEquipo.model");
const { uploader } = require("../libs/cloudinary");
const fs = require("fs-extra");

const createUneteEquipo = async (req, res) => {
  try {
    const { Titulo, Subtitulo, Beneficios, TextoBoton } = req.body;

    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      publicId = result.public_id;
      await fs.unlink(req.file.path);
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

    if (req.file) {
      if (publicId) await uploader.destroy(publicId);
      const result = await uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      publicId = result.public_id;
      await fs.unlink(req.file.path);
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

    if (registro.PublicId) await uploader.destroy(registro.PublicId);

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
