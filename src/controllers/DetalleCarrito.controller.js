/* const { Op } = require("sequelize"); */
/* const Categoria = require("../db/models/Categoria.model");
const Marca = require("../db/models/Marca.model"); */
const DetalleCarrito = require ("../db/models/DetalleCarrito.model");
const Productos = require("../db/models/productos_Better.model");



async function VerDetalleCarrito(req, res) {
  try {
    const userId = req.query.userId; // Obtener el userId de la solicitud

    const Carrito = await DetalleCarrito.findAll({
      where: { IdCliente: userId }, // Filtrar por el userId
      include: [
        {
          model: Productos,
          as: "producto",
          attributes: ['IdProducto', 'vchNombreProducto', 'Precio', 'vchNomImagen', 'vchDescripcion']
        }
      ],
    });

    res.json(Carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el detalle del carrito" });
  }
}

/* 
  async function VerDetalleCarrito(req, res) {
    try {
      const userId = req.query.userId; // Obtener el userId de la solicitud
      const Carrito = await DetalleCarrito.findAll({
        where: { IdCliente: userId }, // Filtrar por el userId
        include: [
          { model: Productos, as: "producto", attributes: ['IdProducto', 'vchNombreProducto', 'Precio'] },
          { model: Graduacion, as: "graduacion", attributes: ['IdGraduacion', 'ValorGraduacion', 'Precio'] },
          { model: Tratamiento, as: "tratamiento", attributes: ['IdTratamiento', 'Nombre', 'Precio'] },
        ],
      });
      res.json(Carrito);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el detalle del carrito" });
    }
  } */


  async function createDetalleCarrito(req, res) {
    const 
    { 
      IdProducto,
      Precio, 
      Descripcion, 
      SubTotal, 
      Cantidad, 
      IdCarrito 
    } = req.body;

    // Validación de longitud de la descripción
    if (Descripcion && Descripcion.length > 1000) {
      return res.status(400).json({
        message: "La descripción es demasiado larga. Máximo 1000 caracteres.",
      });
    }

    try {

      // Crear el detalle de carrito utilizando el IdCarrito del carrito creado o existente
      const detalleCarrito = await DetalleCarrito.create({
        IdProducto,
        Precio,
        Descripcion,
        SubTotal,
        Cantidad,
        IdCarrito,
      });
  
      res.status(201).json(detalleCarrito);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el detalle de carrito" });
    }
  }



async function eliminarDetalleCarrito(req, res) {
  const { idCarrito, idDetalle } = req.params;
  const { tipo } = req.query; // 'carrito' o 'producto'

  try {
    let condicion;
    let mensaje;
    
    if (tipo === 'carrito' || idCarrito) {
      condicion = { IdCarrito: idCarrito };
      mensaje = "Todos los detalles del carrito eliminados exitosamente";
    } else if (tipo === 'producto' || idDetalle) {
      condicion = { IdDetalle_Carrito: idDetalle };
      mensaje = "Producto eliminado del carrito exitosamente";
    } else {
      return res.status(400).json({ 
        message: "Debe especificar idCarrito o idDetalle, o usar el parámetro tipo" 
      });
    }

    const resultado = await DetalleCarrito.destroy({ where: condicion });
    
    if (resultado === 0) {
      return res.status(404).json({ 
        message: tipo === 'producto' ? "Producto no encontrado en el carrito" : "Carrito no encontrado" 
      });
    }
    
    res.status(200).json({ message: mensaje });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar del carrito" });
  }
}

async function modificarCantidadProducto(req, res) {
  const { idDetalle } = req.params;
  const { accion } = req.body; // 'aumentar' o 'disminuir'

  try {
    const detalleCarrito = await DetalleCarrito.findByPk(idDetalle);
    
    if (!detalleCarrito) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito" });
    }

    let nuevaCantidad;
    let mensaje;

    if (accion === 'aumentar') {
      nuevaCantidad = detalleCarrito.Cantidad + 1;
      mensaje = "Cantidad aumentada exitosamente";
    } else if (accion === 'disminuir') {
      if (detalleCarrito.Cantidad <= 1) {
        return res.status(400).json({ 
          message: "No se puede disminuir más la cantidad. Use eliminar producto si desea quitarlo del carrito" 
        });
      }
      nuevaCantidad = detalleCarrito.Cantidad - 1;
      mensaje = "Cantidad disminuida exitosamente";
    } else {
      return res.status(400).json({ 
        message: "Acción no válida. Use 'aumentar' o 'disminuir'" 
      });
    }

    const nuevoSubTotal = nuevaCantidad * detalleCarrito.Precio;

    await detalleCarrito.update({
      Cantidad: nuevaCantidad,
      SubTotal: nuevoSubTotal
    });

    res.status(200).json({
      message: mensaje,
      detalle: detalleCarrito
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al modificar la cantidad del producto" });
  }
}


module.exports = {
    VerDetalleCarrito,
    createDetalleCarrito,
    eliminarDetalleCarrito,
    modificarCantidadProducto
};
