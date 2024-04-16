const express = require('express');
const router = express.Router();
const Carrito = require('../controllers/Carrito.controller');


// Ruta para obtener todos los clientes
router.get('/Carrito', Carrito.getAllCarrito)
router.post('/crearCarrito', Carrito.createCarrito );

router.get('/uno', Carrito.VerDetalleCarrito );
router.delete('/eliminarCa', Carrito.eliminarDetalleCarrito);


module.exports = router;
