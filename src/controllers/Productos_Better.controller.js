const Productos_Better = require("../db/models/productos_Better.model");
const { Op } = require("sequelize");
const Categoria = require("../db/models/Categoria.model");
const Empleado = require("../db/models/CrearEmpleado.model");
// Importa webpush si aún no está importado
const webpush = require('../services/webPush'); // Ajusta la ruta si es necesario
const  Suscripcion  = require('../db/models/suscripciones.model'); // Asegúrate de que la importación sea correcta


const cloudinary = require('../services/cloudinari')

//Ver productos

async function getProductos(req, res) {
  try {
    const productos = await Productos_Better.findAll({
      where: {
        Existencias: {
          [Op.gt]: 0, // Utiliza Op.gt (greater than) para obtener solo los productos con Existencias mayores a cero
        },
      },
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
      ],
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

async function getProductosAll(req, res) {
  try {
    const productos = await Productos_Better.findAll({
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
        {
          model: Empleado,
          as: "empleado",
          attributes: ["vchNombre", "vchAPaterno", "vchAMaterno"],
        },
      ],
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

//Ver Ofertas
async function getProductosOfertas(req, res) {
  try {
    const productos = await Productos_Better.findAll({
      where: {
        Existencias: {
          [Op.gt]: 0, // Solo productos con Existencias mayores a cero
        },
        EnOferta: 1, // Solo productos en oferta
      },
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
      ],
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}
// Desactivar producto
async function desactivarProducto(req, res) {
  try {
    const { id } = req.params;
    const producto = await Productos_Better.findByPk(id);
    if (producto) {
      producto.activo = false;
      producto.Existencias = 0;
      await producto.save();
      res.json({ message: "Producto desactivado correctamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al desactivar el producto" });
  }
}


  //Agregar nuevo producto
  const createProductos = async (req, res) => {
    const {
      vchNombreProducto,
      vchDescripcion,
      Existencias,
      IdCategoria,
      Precio,
      EnOferta,
      PrecioOferta,
      IdEmpleado,
    } = req.body;

    // Validación de longitud de la descripción
    if (vchDescripcion && vchDescripcion.length > 1000) {
      return res.status(400).json({
        message: "La descripción es demasiado larga. Máximo 1000 caracteres.",
      });
    }

    try {
      if (!req.files || !req.files.image) {
        return res
          .status(400)
          .json({ message: "No se ha seleccionado ningún archivo." });
      }

      const file = req.files.image;
      // Subir la imagen a Cloudinary y obtener la URL
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "Productos",
      });

      const nuevoProducto = await Productos_Better.create({
        vchNombreProducto,
        vchNomImagen: result.url,
        vchDescripcion,
        Existencias,
        IdCategoria,
        Precio,
        EnOferta,
        PrecioOferta,
        IdEmpleado,
      });

      // Obtener suscripciones activas
      const suscripciones = await Suscripcion.findAll({
        where: { Estado: "activo" },
      });

      const payload = JSON.stringify({
        title: "Nuevo producto agregado",
        body: `Se ha agregado ${vchNombreProducto} al catálogo.`,
        icon: "../img/notificacion.jpg",
        image: result.url,
        vibrate: [100, 50, 100],
        actions: [
          {
            action: "explore",
            title: "Ver detalles del producto",
            icon: result.url,
            url: `https://opticenter-hue.vercel.app/lentes`,
          },
        ],
      });

      suscripciones.forEach((subscription) => {
        try {
          const keys = subscription.Keys ? JSON.parse(subscription.Keys) : null;
          if (!keys || !keys.p256dh || !keys.auth) return;

          webpush
            .sendNotification(
              {
                endpoint: subscription.Endpoint,
                keys: {
                  p256dh: keys.p256dh,
                  auth: keys.auth,
                },
              },
              payload
            )
            .catch(console.error);
        } catch (error) {
          console.error("Error al enviar notificación:", error);
        }
      });

      res.status(201).json(nuevoProducto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el producto." });
    }
  };

// Función para agregar suscripciones
const agregarSuscripcion = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({ error: 'Datos de suscripción incompletos.' });
    }

    // Crea un nuevo registro de suscripción en la base de datos
    const nuevaSuscripcion = await Suscripcion.create({
      Endpoint: endpoint,
      Keys: JSON.stringify(keys), // Convierte el objeto keys a una cadena JSON
      Auth: keys.auth,
      FechaSuscripcion: new Date(),
      Estado: 'activo'
    });

    return res.status(201).json({ message: 'Suscripción guardada exitosamente', nuevaSuscripcion });
  } catch (error) {
    console.error('Error al guardar la suscripción:', error);
    return res.status(500).json({ error: 'Error al guardar la suscripción.' });
  }
};

//Busqueda de productos por letra o nombre xd
async function BuscarProducto(req, res) {
  const { busqueda } = req.query;

  try {
    let productos;
    if (busqueda) {
      productos = await Productos_Better.findAll({
        where: {
          vchNombreProducto: {
            [Op.like]: `%${busqueda}%`,
          },
          Existencias: {
            [Op.gt]: 0, // Excluir productos con Existencias igual a cero
          },
        },
      });
    } else {
      productos = await Productos_Better.findAll({
        where: {
          Existencias: {
            [Op.gt]: 0, // Excluir productos con Existencias igual a cero
          },
        },
      });
    }
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}


async function BuscarProductoPorCategoria(req, res) {
  const { categoria } = req.query;

  // Lista válida de categorías
  const categoriasValidas = [
    "Cocina",
    "Hogar",
    "Recamara",
    "Limpieza",
    "Baño",
    "Contigo",
    "Bienestar",
  ];

  try {
    let productos;

    if (categoria && categoriasValidas.includes(categoria)) {
      // Buscar productos por categoría válida
      productos = await Productos_Better.findAll({
        include: [
          {
            model: Categoria,
            as: "categoria",
            where: { NombreCategoria: categoria },
          },
        ],
      });
    } else {
      // Buscar todos los productos si no se especifica o no es válida la categoría
      productos = await Productos_Better.findAll({
        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: ["NombreCategoria"],
          },
        ],
      });
    }

    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

const ProductoPorIdParadetalle = async ( req, res ) => {
  try {
      const { IdProducto } = req.body;
      const producto = await Productos_Better.findByPk(IdProducto, {
        include: [
          {
            model: Categoria,
            as: "categoria",
            attributes: ["NombreCategoria"],
          },
        ],
      });

      if(!producto){
        return res.status(404).json({ success: false, message: "Producto no encontrado" });

      }
      res.json(producto);
  } catch (error) {
      res.status(500).send({ success: false, message: error.message });
  }
}

const ProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Productos_Better.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
      ],
    });

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vchNombreProducto,
      vchDescripcion,
      Precio,
      Existencias,
      IdCategoria,
      vchNomImagen,
      EnOferta,
      PrecioOferta,
    } = req.body;

    const producto = await Productos_Better.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Asignaciones con validación de null/undefined (permitimos falsy como 0, false, "")
    if (vchNombreProducto)
      producto.vchNombreProducto = vchNombreProducto;
    if (vchDescripcion) producto.vchDescripcion = vchDescripcion;
    if (Precio) producto.Precio = Precio;
    if (Existencias !== undefined) producto.Existencias = Existencias;
    if (IdCategoria) producto.IdCategoria = IdCategoria;
    if (vchNomImagen) producto.vchNomImagen = vchNomImagen;
    if (EnOferta !== undefined) producto.EnOferta = EnOferta;
    if (PrecioOferta) producto.PrecioOferta = PrecioOferta;

    await producto.save();

    res.json({ message: "Producto actualizado con éxito", producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

async function deleteProducto(req, res) {
  try {
    const { id } = req.params;
    const producto = await Productos_Better.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await producto.destroy();

    res.json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
}


async function updateProductosExistencias(req, res) {
  try {
      const { detalleCarrito } = req.body;
      detalleCarrito.forEach(async (detalle) => {
          const producto = await Productos_Better.findByPk(detalle.IdProducto);
          if (producto) {
              producto.Existencias -= detalle.Cantidad;
              await producto.save();
          }
      });
      res.json({ message: "Existencias actualizadas correctamente" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar las existencias" });
  }
}




// Buscar productos en oferta por nombre
async function BuscarProductoEnOfertaPorNombre(req, res) {
  const { nombre } = req.params;

  try {
    const productos = await Productos_Better.findAll({
      where: {
        vchNombreProducto: {
          [Op.like]: `%${nombre}%`,
        },
        Existencias: {
          [Op.gt]: 0,
        },
        EnOferta: 1,
      },
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
      ],
    });

    if (productos.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos en oferta con el nombre especificado" });
    }

    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar productos en oferta por nombre" });
  }
}

async function BuscarProductoPorNombres  (req, res) {
  try {
    const nombre = req.params.nombre;
    if (!nombre) {
      return res.status(400).json({ message: "Nombre del producto es requerido" });
    }

    const productos = await Productos_Better.findAll({
      where: {
        vchNombreProducto: {
          [Op.like]: `%${nombre.replace(/[^a-zA-Z0-9\s]/g, "")}%`, // Eliminar caracteres especiales que puedan causar problemas
        },
        Existencias: {
          [Op.gt]: 0,
        },
      },
      include: [
        {
          model: Categoria,
          attributes: ["IdCategoria", "NombreCategoria"],
        },
      ],
    });

    if (productos.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }

    res.json(productos);
  } catch (error) {
    console.error('Error en la búsqueda de productos:', error);
    res.status(500).send('Error en el servidor');
  }
};


module.exports = {
  getProductos,
  getProductosAll,
  getProductosOfertas,
  desactivarProducto,
  createProductos,
  BuscarProducto,
  BuscarProductoPorCategoria,
  ProductoPorIdParadetalle,
  ProductoPorId,
  updateProducto,
  deleteProducto,
  updateProductosExistencias,
  BuscarProductoEnOfertaPorNombre,
  BuscarProductoPorNombres,
  agregarSuscripcion,
};
