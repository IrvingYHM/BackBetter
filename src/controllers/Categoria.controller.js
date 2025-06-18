const Categoria = require("../db/models/Categoria.model");

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener las categorías" });
  }
};

// Obtener categoría por ID
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    res.status(500).json({ message: "Error al obtener la categoría" });
  }
};

// Crear nueva categoría
const createCategoria = async (req, res) => {
  try {
    const { NombreCategoria } = req.body;

    if (!NombreCategoria) {
      return res
        .status(400)
        .json({ message: "El nombre de la categoría es requerido" });
    }

    const nuevaCategoria = await Categoria.create({ NombreCategoria });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    res.status(500).json({ message: "Error al crear la categoría" });
  }
};

// Actualizar categoría
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { NombreCategoria } = req.body;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    categoria.NombreCategoria = NombreCategoria || categoria.NombreCategoria;
    await categoria.save();

    res.json({ message: "Categoría actualizada correctamente", categoria });
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    res.status(500).json({ message: "Error al actualizar la categoría" });
  }
};

// Eliminar categoría
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await categoria.destroy();
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    res.status(500).json({ message: "Error al eliminar la categoría" });
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
