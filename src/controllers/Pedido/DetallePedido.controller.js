const PedidoDetalle = require('../../db/models/Pedido/DetallePedido.model');


// Controlador para obtener todos los clientes
async function getAllDetallePedidos(req, res) {
    try {
      const PedidosDetalles = await PedidoDetalle.findAll();
      res.json(PedidosDetalles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los detalles pedidos" });
    }
  }




async function CrearDetallePedido(req, res) {
    const { IdProducto, IdGraduacion, IdTratamiento, Precio, Descripcion, SubTotal, Cantidad, IdPedido } = req.body;
    try {
        const nuevoDetallePedido = await PedidoDetalle.create({
            IdProducto,
            IdGraduacion,
            IdTratamiento,
            Precio,
            Descripcion,
            SubTotal,
            Cantidad,
            IdPedido
        });
        res.status(201).json(nuevoDetallePedido);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el detalle del pedido" });
    }
}




  module.exports = {
    getAllDetallePedidos,
    CrearDetallePedido
  };