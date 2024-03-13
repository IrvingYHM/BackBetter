const express = require('express');
const router = express.Router();
const authControllerProductos = require('../controllers/Productos.controller');

// Ruta para iniciar sesión
router.get('/Productos', authControllerProductos.getProductos); // Utilizar el método login del controlador de autenticación

router.post('/Crear_productos', authControllerProductos.createProductos);
router.get('/Buscar_productos', authControllerProductos.getProductos);


module.exports = router;
