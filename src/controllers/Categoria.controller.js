const Categoria = require("../db/models/Categoria.model");
const Productos_Better = require("../db/models/productos_Better.model");

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

// Verificar si una categoría tiene productos asociados
const checkCategoriaProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    const productCount = await Productos_Better.count({
      where: { IdCategoria: id }
    });

    res.json({ 
      categoria: categoria.NombreCategoria,
      productCount: productCount,
      canDelete: productCount === 0
    });
  } catch (error) {
    console.error("Error al verificar productos de la categoría:", error);
    res.status(500).json({ message: "Error al verificar la categoría" });
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

    // Verificar si la categoría tiene productos asociados
    const productCount = await Productos_Better.count({
      where: { IdCategoria: id }
    });

    if (productCount > 0) {
      return res.status(400).json({ 
        message: `No se puede eliminar la categoría porque tiene ${productCount} producto(s) asociado(s)`,
        productCount: productCount
      });
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
  checkCategoriaProducts,
};
