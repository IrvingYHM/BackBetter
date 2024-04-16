// db/controllers/carrito.controller.js
const  Carrito  = require('../db/models/Carrito.model');
const  tbldetallecarrito  = require('../db/models/DetalleCarrito.model');
const Productos = require('../db/models/producto.model'); // Importar el modelo Productos
const Graduacion = require('../db/models/Detalle_carrito/Graduacion.model');
const Tratamiento = require('../db/models/Detalle_carrito/Tratamiento.model');



// Controlador para obtener todos los clientes
async function getAllCarrito(req, res) {
  try {
    const carritos = await Carrito.findAll();
    res.json(carritos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los carritos" });
  }
}



// Controlador para crear un nuevo cliente
async function createCarrito(req, res) {
  const { IdProducto, IdCliente } = req.body;
  try {
    let carritoExistente = await Carrito.findOne({ where: { IdCliente } });
    if (carritoExistente) {
      res.status(200).json(carritoExistente);
    } else {
      // Crear un nuevo carrito si el cliente no tiene uno
      const nuevoCarrito = await Carrito.create({
        IdProducto,
        IdCliente,
      });
      res.status(201).json(nuevoCarrito);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear o actualizar el carrito" });
  }
}

async function VerDetalleCarrito(req, res) {
  try {
    const userId = req.query.userId; // Obtener el userId de la solicitud
    // Buscar el carrito del cliente
    const carrito = await Carrito.findOne({
      where: { IdCliente: userId },
    });

    if (!carrito) {
      return res.status(404).json({ message: "El cliente no tiene un carrito." });
    }

    // Almacenar el ID del carrito en el estado del cliente
    req.app.locals.clienteIdCarrito = carrito.IdCarrito;

    console.log("ID del carrito del cliente:", carrito.IdCarrito);

    // Buscar los detalles del carrito del cliente
    const detallesCarrito = await tbldetallecarrito.findAll({
      where: { IdCarrito: carrito.IdCarrito },
      include: [
        { model: Productos, as: "producto", attributes: ['IdProducto', 'vchNombreProducto','vchNomImagen', 'Precio'] },
        { model: Graduacion, as: "graduacion", attributes: ['IdGraduacion', 'ValorGraduacion', 'Precio'] },
        { model: Tratamiento, as: "tratamiento", attributes: ['IdTratamiento', 'Nombre', 'Precio'] },
      ],
    });

    res.json(detallesCarrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el detalle del carrito" });
  }
}

async function eliminarDetalleCarrito(req, res) {
  try {
    const idCarrito = req.app.locals.clienteIdCarrito;

    if (!idCarrito) {
      return res.status(404).json({ message: "El cliente no tiene un carrito." });
    }

    await tbldetallecarrito.destroy({ where: { IdCarrito: idCarrito } });
    res.status(200).json({ message: "Detalle del carrito eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el detalle del carrito" });
  }
}



module.exports = {
  getAllCarrito,
  createCarrito,
  VerDetalleCarrito,
  eliminarDetalleCarrito
};