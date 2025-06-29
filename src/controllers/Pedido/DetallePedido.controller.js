const PedidoDetalle = require("../../db/models/Pedido/DetallePedido.model");

const Productos = require("../../db/models/productos_Better.model");
const Pedido = require("../../db/models/Pedido/Pedido.model")
const Cliente = require("../../db/models/cliente.model")

const Categoria = require('../../db/models/Categoria.model');
// Controlador para obtener todos los detalles de pedidos
async function getAllDetallePedidos(req, res) {
  try {
    // Obtener los detalles de los pedidos con las relaciones necesarias
    const pedidosDetalles = await PedidoDetalle.findAll({
      include: [
        { 
          model: Productos, 
          as: "Producto",
          attributes: [
            'IdProducto', 
            'vchNombreProducto',
            'Existencias', 
            'IdCategoria',
            'Precio', 
            'PrecioOferta', 
            'EnOferta'
          ],
          include: [
            { model: Categoria, as: 'categoria', attributes: ['NombreCategoria'] },
          ]
        },
        { 
          model: Pedido, 
          as: "Pedido",
          attributes: [
            'IdCliente',
            'Fecha_Hora',
            'TotalPe'
          ]
        },
      ],
    });

    // Depurar la respuesta completa
    console.log(JSON.stringify(pedidosDetalles, null, 2));

    // Procesar los datos para obtener el formato deseado
    const result = pedidosDetalles.map(detalle => {
      const producto = detalle.Producto || {};
      const pedido = detalle.Pedido || {};
      const categoria = producto.categoria || {};

      return {
        IdProducto: producto.IdProducto,
        IdCliente: pedido.IdCliente,
        NombreProducto: producto.vchNombreProducto,
        Existencias: producto.Existencias,
        Categoria: categoria.NombreCategoria || 'No disponible',
        Precio: producto.Precio,
        PrecioOferta: producto.PrecioOferta,
        TotalVentas: detalle.Cantidad,
        IngresosTotales: detalle.SubTotal,    // Asumiendo que SubTotal es el ingreso total
        FechaPedido: pedido.Fecha_Hora,
        TotalPedido: pedido.TotalPe,
        CantidadPedido: detalle.Cantidad,
        EnOferta: producto.EnOferta
      };
    });

    // Enviar los datos filtrados como respuesta
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los detalles pedidos" });
  }
}


async function CrearDetallePedido(req, res) {
  const {
    IdProducto,
    Precio,
    Descripcion,
    SubTotal,
    Cantidad,
    IdPedido,
  } = req.body;
  try {
    const nuevoDetallePedido = await PedidoDetalle.create({
      IdProducto,
      Precio,
      Descripcion,
      SubTotal,
      Cantidad,
      IdPedido,
    });
    res.status(201).json(nuevoDetallePedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el detalle del pedido" });
  }
}

module.exports = {
  getAllDetallePedidos,
  CrearDetallePedido,
};
