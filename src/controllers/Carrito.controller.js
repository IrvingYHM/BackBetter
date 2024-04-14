// db/controllers/carrito.controller.js
const  Carrito  = require('../db/models/Carrito.model');



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


module.exports = {
  getAllCarrito,
  createCarrito
};