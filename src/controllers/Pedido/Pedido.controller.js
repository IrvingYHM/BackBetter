// db/controllers/carrito.controller.js
const Pedido = require('../../db/models/Pedido/Pedido.model');

/* const  tbldetallecarrito  = require('../db/models/DetalleCarrito.model');
const Productos = require('../db/models/producto.model'); // Importar el modelo Productos
const Graduacion = require('../db/models/Detalle_carrito/Graduacion.model');
const Tratamiento = require('../db/models/Detalle_carrito/Tratamiento.model'); */



// Controlador para obtener todos los clientes
async function getAllPedidos(req, res) {
  try {
    const Pedidos = await Pedido.findAll();
    res.json(Pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los Pedidos" });
  }
}

async function createPedido(req, res) {
  const { IdCliente } = req.body;
  try {
      let nuevoPedidoId;

      // Verificar si el cliente ya tiene un pedido en curso
      const existingPedido = await Pedido.findOne({ where: { IdCliente, IdEstado_Pedido: 1 } });
      if (existingPedido) {
          // Si el cliente ya tiene un pedido en curso, guardar el ID del pedido existente
          nuevoPedidoId = existingPedido.id;
      } else {
          // Si el cliente no tiene un pedido en curso, crear un nuevo pedido
          const nuevoPedido = await Pedido.create({
              Fecha_Hora: new Date(), // Puedes ajustar la fecha y hora según sea necesario
              IdCliente,
              Numero_Guia: 12345, // Puedes generar un número de guía aleatorio
              TotalPe: 0, // Inicialmente el total puede ser 0
              IdMetodoPago: 1, // Aquí puedes usar el Id del método de pago correspondiente
              IdEstado_Pedido: 1, // Aquí puedes usar el Id del estado del pedido correspondiente (por ejemplo, "En curso")
              IdEstado_Envio: 1, // Aquí puedes usar el Id del estado de envío correspondiente
              IdDireccion: 1, // Aquí puedes usar el Id de la dirección del cliente correspondiente
              IdPaqueteria: 1, // Aquí puedes usar el Id de la paquetería correspondiente
              IdEmpleado: 1, // Aquí puedes usar el Id del empleado correspondiente
          });

          // Almacena el ID del nuevo pedido en una variable
          nuevoPedidoId = nuevoPedido.id;
      }

      // Obtener el pedido completo con todos sus datos
      const pedidoCompleto = await Pedido.findOne({ where: { id: nuevoPedidoId } });

      // Enviar el pedido completo en la respuesta
      res.status(201).json({ pedido: pedidoCompleto });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el pedido" });
  }
}


module.exports = {
    getAllPedidos,
    createPedido
};