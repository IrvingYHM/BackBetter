const Slider = require("../db/models/Slider.model");
const cloudinary = require("../services/cloudinari");

// Obtener todos los sliders
const getSliders = async (req, res) => {
  try {
    const sliders = await Slider.findAll();
    res.json(sliders);
  } catch (error) {
    console.error("Error al obtener sliders:", error);
    res.status(500).json({ message: "Error al obtener sliders" });
  }
};

// Crear un nuevo slider
const createSlider = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ message: "No se ha seleccionado ninguna imagen." });
    }

    const { UrlDestino } = req.body;
    const file = req.files.image;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "Sliders",
    });

    const nuevoSlider = await Slider.create({
      Imagen: result.secure_url,
      public_id: result.public_id,
      UrlDestino,
    });

    res.status(201).json(nuevoSlider);
  } catch (error) {
    console.error("Error al crear slider:", error);
    res.status(500).json({ message: "Error al crear slider" });
  }
};

// Actualizar un slider
const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { UrlDestino } = req.body;

    const slider = await Slider.findByPk(id);
    if (!slider)
      return res.status(404).json({ message: "Slider no encontrado" });

    if (req.files && req.files.image) {
      // Eliminar imagen anterior
      await cloudinary.uploader.destroy(slider.public_id);

      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          folder: "Sliders",
        }
      );

      slider.Imagen = result.secure_url;
      slider.public_id = result.public_id;
    }

    slider.UrlDestino = UrlDestino || slider.UrlDestino;

    await slider.save();
    res.json({ message: "Slider actualizado correctamente", slider });
  } catch (error) {
    console.error("Error al actualizar slider:", error);
    res.status(500).json({ message: "Error al actualizar slider" });
  }
};

// Eliminar un slider
const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;

    const slider = await Slider.findByPk(id);
    if (!slider)
      return res.status(404).json({ message: "Slider no encontrado" });

    await cloudinary.uploader.destroy(slider.public_id);
    await slider.destroy();

    res.json({ message: "Slider eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar slider:", error);
    res.status(500).json({ message: "Error al eliminar slider" });
  }
};

module.exports = {
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
};
