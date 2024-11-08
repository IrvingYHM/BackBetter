const express = require('express');
const router = express.Router();
const authControllerProductos = require('../controllers/Productos.controller');
/* const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); */
const multer = require('multer');
const { guardarSuscripcionEnBD } = require('../controllers/suscripcion.controller'); // Importamos la función


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

// Ruta para iniciar sesión
router.get('/Productos', authControllerProductos.getProductos); // Utilizar el método login del controlador de autenticación
router.get('/ProductosOfertas', authControllerProductos.getProductosOfertas); // Utilizar el método login del controlador de autenticación



router.post('/suscribirse', async (req, res) => {
  const { endpoint, keys } = req.body;

  // Verificamos que se haya enviado la información necesaria
  if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Guardamos la suscripción en la base de datos
    await guardarSuscripcionEnBD({ endpoint, keys });

    // Enviamos una respuesta de éxito
    res.status(201).json({ message: 'Suscripción guardada correctamente' });
  } catch (error) {
    // En caso de error, respondemos con un mensaje de error
    console.error('Error al guardar la suscripción:', error);
    res.status(500).json({ error: 'Error al guardar la suscripción' });
  }
});

router.post('/Crear_productos',authControllerProductos.createProductos)
/* router.post('/Crear_productos', upload.single('imagen'), authControllerProductos.createProductos) */

router.get('/Buscar_productos', authControllerProductos.BuscarProducto);
router.get('/filtro_producto', authControllerProductos.BuscarProductoPorCategoria);
router.post('/productosId', authControllerProductos.ProductoPorIdParadetalle);
router.post('/update', authControllerProductos.updateProductosExistencias);
router.get('/find/:nombre', authControllerProductos.BuscarProductoEnOfertaPorNombre);






router.get('/Productos/:id', authControllerProductos.ProductoPorId); 
router.put('/Productos/:id', authControllerProductos.updateProducto); 
router.delete('/Productos/:id', authControllerProductos.deleteProducto);
router.put('/desactivar/:id', authControllerProductos.desactivarProducto);
/* router.get('/filtro_Marca', authControllerProductos.BuscarProductoPorMarca); */
/* 
BuscarProductoPorMarca */

router.get('/Buscar_productosNombres/:nombre', authControllerProductos.BuscarProductoPorNombres);

/* 
/filtro_producto?Categoria=valor&graduacion=valor&marca=valor */
module.exports = router;
