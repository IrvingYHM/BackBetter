// db/controllers/pedido.controller.js
const Pedido = require("../../db/models/Pedido/Pedido.model");
const DetallePedido = require('../../db/models/Pedido/DetallePedido.model');
const Productos = require('../../db/models/productos_Better.model'); // Importar el modelo Productos

// Importar los modelos necesarios
const Cliente = require("../../db/models/cliente.model");
const Paqueteria = require("../../db/models/Pedido/Paqueteria.model");
const MetodoPago = require("../../db/models/Pedido/MetodoPago.model");
const DireccionCliente = require("../../db/models/Direc_Client.model");
const Empleado = require("../../db/models/CrearEmpleado.model");
const EstadoPedido = require("../../db/models/Pedido/EstadoPedido.model");
const EstadoEnvio = require("../../db/models/Pedido/EstadoEnvio.model");

// Controlador para obtener todos los pedidos
async function getAllPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
}

// Controlador para crear un nuevo pedido
async function createPedido(req, res) {
  const { IdCliente, IdEmpleado } = req.body;
  try {
    let pedidoExistente = await Pedido.findOne({ where: { IdCliente } });
    if (pedidoExistente) {
      await pedidoExistente.update({IdEstado_Pedido: 1});
      res.status(200).json(pedidoExistente);
    } else {
      // Crear un nuevo pedido si el cliente no tiene uno
      const nuevoPedido = await Pedido.create({
        IdCliente,
        IdEmpleado,
        Fecha_Hora: new Date(),
      });
      res.status(201).json(nuevoPedido);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear o actualizar el pedido" });
  }
}

async function VerDetallePedido(req, res) {
  try {
    const userId = req.query.userId; // Obtener el userId de la solicitud
    // Buscar el pedido del cliente
    const pedido = await Pedido.findOne({
      where: { IdCliente: userId },
    });

    if (!pedido) {
      return res.status(404).json({ message: "El cliente no tiene un pedido." });
    }

    // Almacenar el ID del pedido en el estado del cliente
    req.app.locals.clienteIdPedido = pedido.IdPedido;

    console.log("ID del pedido del cliente:", pedido.IdPedido);

    // Buscar los detalles del pedido del cliente
    const detallesPedido = await DetallePedido.findAll({
      where: { IdPedido: pedido.IdPedido },
      include: [
        { model: Productos, as: "Producto", attributes: ['IdProducto', 'vchNombreProducto','vchNomImagen', 'Precio'] },
      ],
    });

    res.json(detallesPedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el detalle del pedido" });
  }
}

async function eliminarDetallePedido(req, res) {
  try {
    const idPedido = req.app.locals.clienteIdPedido;

    if (!idPedido) {
      return res.status(404).json({ message: "El cliente no tiene un pedido." });
    }

    // Buscar el pedido usando el idPedido
    const pedido = await Pedido.findOne({ where: { IdPedido: idPedido } });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    // Verificar el estado del pedido
    if (pedido.IdEstado_Pedido !== 3) {
      return res.status(400).json({ message: "El estado del pedido no permite eliminación." });
    }

    // Eliminar el detalle del pedido
    await DetallePedido.destroy({ where: { IdPedido: idPedido } });
    res.status(200).json({ message: "Detalle del pedido eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el detalle del pedido" });
  }
}

module.exports = {
  getAllPedidos,
  createPedido,
  VerDetallePedido,
  eliminarDetallePedido
};
