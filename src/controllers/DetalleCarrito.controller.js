/* const { Op } = require("sequelize"); */
/* const Categoria = require("../db/models/Categoria.model");
const Marca = require("../db/models/Marca.model"); */
const DetalleCarrito = require ("../db/models/DetalleCarrito.model");
const Productos = require("../db/models/producto.model");



async function VerDetalleCarrito(req, res) {
  try {
    const userId = req.query.userId; // Obtener el userId de la solicitud

    const Carrito = await DetalleCarrito.findAll({
      where: { IdCliente: userId }, // Filtrar por el userId
      include: [
        {
          model: Productos,
          as: "producto",
          attributes: ['IdProducto', 'vchNombreProducto', 'Precio', 'vchNomImagen', 'vchDescripcion']
        }
      ],
    });

    res.json(Carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el detalle del carrito" });
  }
}

/* 
  async function VerDetalleCarrito(req, res) {
    try {
      const userId = req.query.userId; // Obtener el userId de la solicitud
      const Carrito = await DetalleCarrito.findAll({
        where: { IdCliente: userId }, // Filtrar por el userId
        include: [
          { model: Productos, as: "producto", attributes: ['IdProducto', 'vchNombreProducto', 'Precio'] },
          { model: Graduacion, as: "graduacion", attributes: ['IdGraduacion', 'ValorGraduacion', 'Precio'] },
          { model: Tratamiento, as: "tratamiento", attributes: ['IdTratamiento', 'Nombre', 'Precio'] },
        ],
      });
      res.json(Carrito);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el detalle del carrito" });
    }
  } */


  async function createDetalleCarrito(req, res) {
    const 
    { 
      IdProducto,
      Precio, 
      Descripcion, 
      SubTotal, 
      Cantidad, 
      IdCarrito 
    } = req.body;
    try {

      // Crear el detalle de carrito utilizando el IdCarrito del carrito creado o existente
      const detalleCarrito = await DetalleCarrito.create({
        IdProducto,
        Precio,
        Descripcion,
        SubTotal,
        Cantidad,
        IdCarrito,
      });
  
      res.status(201).json(detalleCarrito);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el detalle de carrito" });
    }
  }



async function eliminarDetalleCarrito(req, res) {
  const { idCarrito } = req.params;

  try {
    await DetalleCarrito.destroy({ where: { IdCarrito: idCarrito } });
    res.status(200).json({ message: "Detalle del carrito eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el detalle del carrito" });
  }
}


module.exports = {
    VerDetalleCarrito,
    createDetalleCarrito,
    eliminarDetalleCarrito
};
