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
      const numeroGuia = Math.floor(Math.random() * 1000000) + 100000; // Generar número de guía temporal
      
      const nuevoPedido = await Pedido.create({
        IdCliente,
        IdEmpleado: IdEmpleado || 1,
        Fecha_Hora: new Date(),
        Numero_Guia: numeroGuia,
        TotalPe: 0, // Se actualizará cuando se calcule el total
        IdMetodoPago: 1, // Pago contra entrega por defecto
        IdEstado_Pedido: 1, // Pendiente
        IdEstado_Envio: 1, // Pendiente
        IdDireccion: 1, // Se actualizará con la dirección real
        IdPaqueteria: 1 // Paquetería por defecto
      });
      res.status(201).json(nuevoPedido);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear o actualizar el pedido" });
  }
}

// Controlador para crear un pedido completo (nuevo sistema)
async function crearPedidoCompleto(req, res) {
  const {
    IdCliente,
    TotalPe,
    IdMetodoPago,
    IdEstado_Pedido,
    IdEstado_Envio,
    IdDireccion,
    IdPaqueteria,
    IdEmpleado,
    CostoEnvio,
    numeroPedido,
    datosEnvio
  } = req.body;

  try {
    const nuevoPedido = await Pedido.create({
      IdCliente,
      TotalPe,
      IdMetodoPago: IdMetodoPago || 1, // Pago contra entrega por defecto
      IdEstado_Pedido: IdEstado_Pedido || 1, // Pendiente por defecto
      IdEstado_Envio: IdEstado_Envio || 1, // Pendiente por defecto
      IdDireccion: IdDireccion || 1,
      IdPaqueteria: IdPaqueteria || 1,
      IdEmpleado: IdEmpleado || 1,
      CostoEnvio: CostoEnvio || 0,
      Fecha_Hora: new Date(),
      numeroPedido,
      datosEnvio: JSON.stringify(datosEnvio)
    });

    res.status(201).json({ pedido: nuevoPedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el pedido completo" });
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

// Controlador para obtener todos los pedidos de un cliente específico
async function getPedidosByClienteId(req, res) {
  try {
    const { clienteId } = req.params;
    
    const pedidos = await Pedido.findAll({
      where: { IdCliente: clienteId },
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          include: [
            {
              model: Productos,
              as: "Producto",
              attributes: ['IdProducto', 'vchNombreProducto', 'vchNomImagen', 'Precio']
            }
          ]
        },
        {
          model: Cliente,
          as: "cliente",
          attributes: ['vchNombre', 'vchApellidos', 'vchTelefono', 'vchCorreo']
        },
        {
          model: DireccionCliente,
          as: "direccion",
          attributes: ['Estado', 'Municipio', 'Colonia', 'Calle', 'NumExt', 'NumInt', 'Referencia']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los pedidos del cliente" });
  }
}

module.exports = {
  getAllPedidos,
  createPedido,
  crearPedidoCompleto,
  VerDetallePedido,
  eliminarDetallePedido,
  getPedidosByClienteId
};
