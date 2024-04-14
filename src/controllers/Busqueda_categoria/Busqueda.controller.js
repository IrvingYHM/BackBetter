/* const Productos = require("../db/models/producto.model");

//Busqueda de productos por letra o nombre xd
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
/*       createProductos,
      getProductos */
/*   };
   */