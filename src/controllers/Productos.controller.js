const Productos = require("../db/models/producto.model");
const { Op } = require("sequelize");
const Categoria = require("../db/models/Categoria.model");
const Marca = require("../db/models/Marca.model");
// Importa webpush si aún no está importado
const webpush = require('../services/webPush'); // Ajusta la ruta si es necesario
const  Suscripcion  = require('../db/models/suscripciones.model'); // Asegúrate de que la importación sea correcta


/* const Graduacion = require("../db/models/Graduacion.model"); */
/* const Suscripcion = require('../db/models/suscripciones.model'); // Ajusta la ruta según la ubicación de tu modelo */


const cloudinary = require('../services/cloudinari')

//Ver productos

async function getProductos(req, res) {
  try {
    const productos = await Productos.findAll({
      where: {
        Existencias: {
          [Op.gt]: 0, // Utiliza Op.gt (greater than) para obtener solo los productos con Existencias mayores a cero
        },
      },
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
        { model: Marca, as: "marca", attributes: ["NombreMarca"] },
        /*         { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
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
    const productos = await Productos.findAll({
      where: {
        Existencias: {
          [Op.gt]: 0, // Solo productos con Existencias mayores a cero
        },
        EnOferta: 1, // Solo productos en oferta
      },
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
        { model: Marca, as: "marca", attributes: ["NombreMarca"] },
        /* { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
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
    const producto = await Productos.findByPk(id);
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



const createProductos = async (req, res) => {
  const {
    vchNombreProducto,
    vchDescripcion,
    Existencias,
    IdCategoria,
    IdMarca,
    Precio,
    EnOferta,
    PrecioOferta,
  } = req.body;

  try {
    console.log("Paso 1: Datos recibidos:", req.body);
    console.log("Paso 2: Archivos recibidos:", req.files);

    if (!req.files || !req.files.image) {
      console.log("Error: No se recibió archivo de imagen");
      return res
        .status(400)
        .json({ message: "No se ha seleccionado ningún archivo." });
    }

    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "Productos",
    });
    console.log("Paso 3: Imagen subida a Cloudinary. URL:", result.url);

    const nuevoProducto = await Productos.create({
      vchNombreProducto,
      vchNomImagen: result.url,
      vchDescripcion,
      Existencias,
      IdCategoria,
      IdMarca,
      Precio,
      EnOferta,
      PrecioOferta,
    });
    console.log("Paso 4: Producto creado en DB. ID:", nuevoProducto.id);

    // Notificaciones...
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

    for (const subscription of suscripciones) {
      try {
        const keys = subscription.Keys ? JSON.parse(subscription.Keys) : null;
        if (!keys || !keys.p256dh || !keys.auth) continue;

        await webpush.sendNotification(
          {
            endpoint: subscription.Endpoint,
            keys: {
              p256dh: keys.p256dh,
              auth: keys.auth,
            },
          },
          payload
        );
      } catch (error) {
        console.error("Error al enviar notificación:", error.message);
      }
    }

    console.log("Paso 5: Notificaciones enviadas");
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("🚨 Error en createProductos:", error.message);
    res
      .status(500)
      .json({ message: "Error al crear el producto.", error: error.message });
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
      productos = await Productos.findAll({
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
      productos = await Productos.findAll({
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
  const { categoria, marca } = req.query;

  try {
    let productos;
    if (categoria && categoria.toLowerCase() === "lentes de sol") {
      productos = await Productos.findAll({
        include: [
          {
            model: Categoria,
            as: "categoria",
            where: { NombreCategoria: "Lentes de sol" },
          },
          { model: Marca, as: "marca", attributes: ["NombreMarca"] },
          /*           { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
        ],
      });
    } else if (categoria && categoria.toLowerCase() === "lentes graduados") {
      productos = await Productos.findAll({
        include: [
          {
            model: Categoria,
            as: "categoria",
            where: { NombreCategoria: "Lentes graduados" },
          },
          { model: Marca, as: "marca", attributes: ["NombreMarca"] },
          /*           { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
        ],
      });
    } else if (
      marca &&
      (marca.toLowerCase() === "ray-ban" ||
        marca.toLowerCase() === "casio" ||
        marca.toLowerCase() === "oakley")
    ) {
      productos = await Productos.findAll({
        include: [
          {
            model: Marca,
            as: "marca",
            where: {
              NombreMarca: marca.charAt(0).toUpperCase() + marca.slice(1),
            },
          },
          {
            model: Categoria,
            as: "categoria",
            attributes: ["NombreCategoria"],
          },
          /*           { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
        ],
      });
    } else {
      productos = await Productos.findAll({
        include: [
          { model: Marca, as: "marca", attributes: ["NombreMarca"] },
          {
            model: Categoria,
            as: "categoria",
            attributes: ["NombreCategoria"],
          },
          /*           { model: Graduacion, as: 'graduacion', attributes: ['ValorGraduacion'] } */
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
      const producto = await Productos.findByPk(IdProducto, {
        include: [
          { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
          { model: Marca, as: "marca", attributes: ["NombreMarca"] },
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
    const producto = await Productos.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
        { model: Marca, as: "marca", attributes: ["NombreMarca"] },
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
    const { vchNombreProducto, vchDescripcion, Precio, Existencias, IdCategoria, IdMarca, vchNomImagen } = req.body;

    const producto = await Productos.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    producto.vchNombreProducto = vchNombreProducto || producto.vchNombreProducto;
    producto.vchDescripcion = vchDescripcion || producto.vchDescripcion;
    producto.Precio = Precio || producto.Precio;
    producto.Existencias = Existencias || producto.Existencias;
    producto.IdCategoria = IdCategoria || producto.IdCategoria;
    producto.IdMarca = IdMarca || producto.IdMarca;
    producto.vchNomImagen = vchNomImagen || producto.vchNomImagen;

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
    const producto = await Productos.findByPk(id);

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
          const producto = await Productos.findByPk(detalle.IdProducto);
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
    const productos = await Productos.findAll({
      where: {
        vchNombreProducto: {
          [Op.like]: `%${nombre}%`
        },
        Existencias: {
          [Op.gt]: 0
        },
        EnOferta: 1
      },
      include: [
        { model: Categoria, as: "categoria", attributes: ["NombreCategoria"] },
        { model: Marca, as: "marca", attributes: ["NombreMarca"] }
      ]
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

    const productos = await Productos.findAll({
      where: {
        vchNombreProducto: {
          [Op.like]: `%${nombre.replace(/[^a-zA-Z0-9\s]/g, '')}%` // Eliminar caracteres especiales que puedan causar problemas
        },
        Existencias: {
          [Op.gt]: 0
        }
      },
      include: [
        {
          model: Categoria,
          attributes: ['IdCategoria', 'NombreCategoria']
        },
        {
          model: Marca,
          attributes: ['IdMarca', 'NombreMarca']
        }
      ]
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
  agregarSuscripcion 
  /*     BuscarProductoPorMarca */
};
