// db/controllers/carrito.controller.js
const Pedido = require('../../db/models/Pedido/Pedido.model');

/* const  tbldetallecarrito  = require('../db/models/DetalleCarrito.model');
const Productos = require('../db/models/producto.model'); // Importar el modelo Productos
const Graduacion = require('../db/models/Detalle_carrito/Graduacion.model');
const Tratamiento = require('../db/models/Detalle_carrito/Tratamiento.model'); */

// Importar los modelos necesarios
const Cliente = require('../../db/models/cliente.model');
const Paqueteria = require('../../db/models/Pedido/Paqueteria.model');
const MetodoPago = require('../../db/models/Pedido/MetodoPago.model');
const DireccionCliente = require('../../db/models/Direc_Client.model');
const Empleado = require('../../db/models/CrearEmpleado.model');
const EstadoPedido = require('../../db/models/Pedido/EstadoPedido.model');
const EstadoEnvio = require('../../db/models/Pedido/EstadoEnvio.model');

// Controlador para obtener todos los pedidos con detalles
async function getAllPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Paqueteria, as: 'paqueteria' },
        { model: MetodoPago, as: 'metodoPago' },
        { model: DireccionCliente, as: 'direccionCliente' },
        { model: Empleado, as: 'Empleado' },
        { model: EstadoPedido, as: 'EstadoPedido' },
        { model: EstadoEnvio, as: 'estadoEnvio' }
      ]
    });
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
}


async function createPedido(req, res) {
  const { 
    IdCliente,
    Numero_Guia, 
    TotalPe, 
    IdMetodoPago, 
    IdEstado_Pedido, 
    IdEstado_Envio, 
    IdDireccion, 
    IdPaqueteria, 
    IdEmpleado 
  } = req.body;

  try {
    let nuevoPedidoId;

    // Verificar si el cliente ya tiene un pedido en curso
    const existingPedido = await Pedido.findOne({ where: { IdCliente, IdEstado_Pedido: 1 } });

    // Asegúrate de que el valor de IdCliente y IdEstado_Pedido esté definido
    console.log('IdCliente:', IdCliente);
    console.log('IdEstado_Pedido:', IdEstado_Pedido);

    if (existingPedido) {
      // Si el cliente ya tiene un pedido en curso, guardar el ID del pedido existente
      nuevoPedidoId = existingPedido.IdPedido;
    } else {
      // Si el cliente no tiene un pedido en curso, crear un nuevo pedido
      const nuevoPedido = await Pedido.create({
        Fecha_Hora: new Date(), // Puedes ajustar la fecha y hora según sea necesario
        IdCliente,
        Numero_Guia,
        TotalPe,
        IdMetodoPago,
        IdEstado_Pedido,
        IdEstado_Envio,
        IdDireccion,
        IdPaqueteria,
        IdEmpleado
      });

      // Almacena el ID del nuevo pedido en una variable
      nuevoPedidoId = nuevoPedido.IdPedido;
    }

    // Obtener el pedido completo con todos sus datos
    const pedidoCompleto = await Pedido.findOne({ where: { IdPedido: nuevoPedidoId } });

    // Enviar el pedido completo en la respuesta
    res.status(201).json({ pedido: pedidoCompleto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el pedido" });
  }
}

async function getPedidoId(req, res) {
  try {
    const { IdCliente } = req.query; // Obtener el IdCliente de la consulta

    let pedidos;
    if (IdCliente) {
      // Si se proporciona un IdCliente, filtrar los pedidos por ese IdCliente
      pedidos = await Pedido.findAll({
        where: { IdCliente },
        include: [
          { model: Cliente, as: 'cliente' },
          { model: Paqueteria, as: 'paqueteria' },
          { model: MetodoPago, as: 'metodoPago' },
          { model: DireccionCliente, as: 'direccionCliente' },
          { model: Empleado, as: 'Empleado' },
          { model: EstadoPedido, as: 'EstadoPedido' },
          { model: EstadoEnvio, as: 'estadoEnvio' }
        ]
      });
    } else {
      // Si no se proporciona un IdCliente, obtener todos los pedidos
      pedidos = await Pedido.findAll({
        include: [
          { model: Cliente, as: 'cliente' },
          { model: Paqueteria, as: 'paqueteria' },
          { model: MetodoPago, as: 'metodoPago' },
          { model: DireccionCliente, as: 'direccionCliente' },
          { model: Empleado, as: 'Empleado' },
          { model: EstadoPedido, as: 'EstadoPedido' },
          { model: EstadoEnvio, as: 'estadoEnvio' }
        ]
      });
    }

    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
}


module.exports = {
    getAllPedidos,
    createPedido,
    getPedidoId
};