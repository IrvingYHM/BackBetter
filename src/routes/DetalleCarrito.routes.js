// cliente.router.js
const express = require('express');
const router = express.Router();
const DetalleCarritoController = require('../controllers/DetalleCarrito.controller');

// Ruta para obtener todos los clientes
router.get('/', DetalleCarritoController.VerDetalleCarrito);
router.post('/crear', DetalleCarritoController.createDetalleCarrito);
router.delete('/eliminarCa', DetalleCarritoController.eliminarDetalleCarrito);



module.exports = router;
