const Productos = require("../db/models/producto.model");
const { Op } = require("sequelize");

// Controlador para obtener todos los clientes
async function getProductos(req, res) {
  try {
    const productos = await Productos.findAll();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

// Controlador para crear un nuevo producto
async function createProductos(req, res) {
  const {
    vchNombreProducto,
    vchNomImagen,
    vchDescripcion,
  } = req.body;
  try {

    const nuevoProducto = await Productos.create({
    vchNombreProducto,
    vchNomImagen,
    vchDescripcion,
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el producto" });
  }
}


async function getProductos(req, res) {
  const { busqueda } = req.query;

  try {
    let productos;
    if (busqueda) {
      productos = await Productos.findAll({
        where: {
          vchNombreProducto: {
            [Op.like]: `%${busqueda}%`,
          },
        },
      });
    } else {
      productos = await Productos.findAll();
    }
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}
module.exports = {
    getProductos,
    createProductos,
    getProductos
};
