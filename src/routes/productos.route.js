const express = require('express');
const router = express.Router();
const authControllerProductos = require('../controllers/Productos.controller');
/* const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); */

// Ruta para iniciar sesión
router.get('/Productos', authControllerProductos.getProductos); // Utilizar el método login del controlador de autenticación

router.post('/Crear_productos',authControllerProductos.createProductos)
/* router.post('/Crear_productos', upload.single('imagen'), authControllerProductos.createProductos) */

router.get('/Buscar_productos', authControllerProductos.BuscarProducto);
router.get('/filtro_producto', authControllerProductos.BuscarProductoPorCategoria);
router.post('/productosId', authControllerProductos.ProductoPorId);
/* router.get('/filtro_Marca', authControllerProductos.BuscarProductoPorMarca); */
/* 
BuscarProductoPorMarca */

/* 
/filtro_producto?Categoria=valor&graduacion=valor&marca=valor */
module.exports = router;
