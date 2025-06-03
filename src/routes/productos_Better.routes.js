const express = require('express');
const router = express.Router();
const authControllerProductos = require('../controllers/Productos_Better.controller');
/* const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); */
const multer = require('multer');



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
router.get('/Productos_Better', authControllerProductos.getProductos); // Utilizar el método login del controlador de autenticación
router.get('/ProductosOfertas_Better', authControllerProductos.getProductosOfertas); // Utilizar el método login del controlador de autenticación


router.post("/suscripcion_Better", authControllerProductos.agregarSuscripcion);



router.post("/Crear_productos_Better", authControllerProductos.createProductos);
/* router.post('/Crear_productos', upload.single('imagen'), authControllerProductos.createProductos) */

router.get("/Buscar_productos_Better", authControllerProductos.BuscarProducto);
router.get('/filtro_producto_Better', authControllerProductos.BuscarProductoPorCategoria);
router.post('/productosId_Better', authControllerProductos.ProductoPorIdParadetalle);
router.post('/update_Better', authControllerProductos.updateProductosExistencias);
router.get('/find_Better/:nombre', authControllerProductos.BuscarProductoEnOfertaPorNombre);






router.get("/Productos_Better/:id", authControllerProductos.ProductoPorId); 
router.put("/Productos_Better/:id", authControllerProductos.updateProducto); 
router.delete("/Productos_Better/:id", authControllerProductos.deleteProducto);
router.put('/desactivar_Better/:id', authControllerProductos.desactivarProducto);
/* router.get('/filtro_Marca', authControllerProductos.BuscarProductoPorMarca); */
/* 
BuscarProductoPorMarca */

router.get('/Buscar_productos_Better/:nombre', authControllerProductos.BuscarProductoPorNombres);

/* 
/filtro_producto?Categoria=valor&graduacion=valor&marca=valor */
module.exports = router;
