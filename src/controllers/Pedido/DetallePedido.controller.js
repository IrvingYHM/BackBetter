const DetallePedido = require("../../db/models/Pedido/DetallePedido.model");
const Productos = require("../../db/models/productos_Better.model");
async function VerDetallePedido(req, res) {
  try {
    const userId = req.query.userId; // Obtener el userId de la solicitud

    const Pedido = await DetallePedido.findAll({
      where: { IdCliente: userId }, // Filtrar por el userId
      include: [
        {
          model: Productos,
          as: "Producto",
          attributes: ['IdProducto', 'vchNombreProducto', 'Precio', 'vchNomImagen', 'vchDescripcion']
        }
      ],
    });

    res.json(Pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el detalle del pedido" });
  }
}


async function createDetallePedido(req, res) {
  const 
  { 
    IdProducto,
    Precio, 
    Descripcion, 
    SubTotal, 
    Cantidad, 
    IdPedido 
  } = req.body;

  // Validación de longitud de la descripción
  if (Descripcion && Descripcion.length > 1000) {
    return res.status(400).json({
      message: "La descripción es demasiado larga. Máximo 1000 caracteres.",
    });
  }

  try {

    // Crear el detalle de pedido utilizando el IdPedido del pedido creado o existente
    const detallePedido = await DetallePedido.create({
      IdProducto,
      Precio,
      Descripcion,
      SubTotal,
      Cantidad,
      IdPedido,
    });

    res.status(201).json(detallePedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el detalle de pedido" });
  }
}

async function eliminarDetallePedido(req, res) {
  const { idPedido } = req.params;

  try {
    await DetallePedido.destroy({ where: { IdPedido: idPedido } });
    res.status(200).json({ message: "Detalle del pedido eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el detalle del pedido" });
  }
}

module.exports = {
    VerDetallePedido,
    createDetallePedido,
    eliminarDetallePedido
};
