const Productos = require("../db/models/producto.model");
const { Op } = require("sequelize");
const Categoria = require("../db/models/Categoria.model");
const Marca = require("../db/models/Marca.model");
/* const Graduacion = require("../db/models/Graduacion.model"); */

const cloudinary = require('../services/cloudinari')

async function getProductos(req, res) {
  try {
    const productos = await Productos.findAll({
      where: {
        Existencias: {
          [Op.gt]: 0, // Utiliza Op.gt (greater than) para obtener solo los productos con Existencias mayores a cero
        },
      },
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
        { model: Marca, as: "marca", attributes: ["NombreMarca"] },
        /*         { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
      ],
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

// Controlador para crear un nuevo producto con imagen en Cloudinary
async function createProductos(req, res) {
  const { 
    vchNombreProducto,
    vchDescripcion, 
    Existencias, 
    IdCategoria, 
    IdMarca,
    Precio
  } = req.body;

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No se ha seleccionado ningún archivo.' });
    }

    const file = req.files.image; // 'image' es el nombre del campo en el formulario

    // Subir la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'Productos'
    });

    console.log(result)

    // Guardar la URL de la imagen en la base de datos
    const nuevoProducto = await Productos.create({
      vchNombreProducto,
      vchNomImagen: result.url,
      vchDescripcion,
      Existencias, 
      IdCategoria, 
      IdMarca,
      Precio
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto.' });
  }
}

//Busqueda de productos por letra o nombre xd
async function BuscarProducto(req, res) {
  const { busqueda } = req.query;

  try {
    let productos;
    if (busqueda) {
      productos = await Productos.findAll({
        where: {
          vchNombreProducto: {
            [Op.like]: `%${busqueda}%`,
          },
          Existencias: {
            [Op.gt]: 0, // Excluir productos con Existencias igual a cero
          },
        },
      });
    } else {
      productos = await Productos.findAll({
        where: {
          Existencias: {
            [Op.gt]: 0, // Excluir productos con Existencias igual a cero
          },
        },
      });
    }
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}


async function BuscarProductoPorCategoria(req, res) {
  const { categoria, marca } = req.query;

  try {
    let productos;
    if (categoria && categoria.toLowerCase() === "lentes de sol") {
      productos = await Productos.findAll({
        include: [
          {
            model: Categoria,
            as: "categoria",
            where: { NombreCategoria: "Lentes de sol" },
          },
          { model: Marca, as: "marca", attributes: ["NombreMarca"] },
          /*           { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
        ],
      });
    } else if (categoria && categoria.toLowerCase() === "lentes graduados") {
      productos = await Productos.findAll({
        include: [
          {
            model: Categoria,
            as: "categoria",
            where: { NombreCategoria: "Lentes graduados" },
          },
          { model: Marca, as: "marca", attributes: ["NombreMarca"] },
          /*           { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
        ],
      });
    } else if (
      marca &&
      (marca.toLowerCase() === "ray-ban" ||
        marca.toLowerCase() === "casio" ||
        marca.toLowerCase() === "oakley")
    ) {
      productos = await Productos.findAll({
        include: [
          {
            model: Marca,
            as: "marca",
            where: {
              NombreMarca: marca.charAt(0).toUpperCase() + marca.slice(1),
            },
          },
          {
            model: Categoria,
            as: "categoria",
            attributes: ["NombreCategoria"],
          },
          /*           { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
        ],
      });
    } else {
      productos = await Productos.findAll({
        include: [
          { model: Marca, as: "marca", attributes: ["NombreMarca"] },
          {
            model: Categoria,
            as: "categoria",
            attributes: ["NombreCategoria"],
          },
          /*           { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
        ],
      });
    }
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

const ProductoPorId = async ( req, res ) => {
  try {
      const { IdProducto } = req.body;
      const producto = await Productos.findByPk(IdProducto, {
        include: [
          { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
          { model: Marca, as: "marca", attributes: ["NombreMarca"] },
        ],
      });

      if(!producto){
        return res.status(404).json({ success: false, message: "Producto no encontrado" });

      }
      res.json(producto);
  } catch (error) {
      res.status(500).send({ success: false, message: error.message });
  }
}


async function updateProductosExistencias(req, res) {
  try {
      const { detalleCarrito } = req.body;
      detalleCarrito.forEach(async (detalle) => {
          const producto = await Productos.findByPk(detalle.IdProducto);
          if (producto) {
              producto.Existencias -= detalle.Cantidad;
              await producto.save();
          }
      });
      res.json({ message: "Existencias actualizadas correctamente" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar las existencias" });
  }
}

module.exports = {
  getProductos,
  createProductos,
  BuscarProducto,
  BuscarProductoPorCategoria,
  ProductoPorId,
  updateProductosExistencias
  /*     BuscarProductoPorMarca */
};
