// cliente.router.js
const express = require('express');
const router = express.Router();
const DetalleCarritoController = require('../controllers/DetalleCarrito.controller');

// Ruta para obtener todos los clientes
router.get('/', DetalleCarritoController.VerDetalleCarrito);
router.post('/crear', DetalleCarritoController.createDetalleCarrito);
router.delete('/eliminar/:idCarrito', DetalleCarritoController.eliminarDetalleCarrito);
router.delete('/eliminar/producto/:idDetalle', DetalleCarritoController.eliminarDetalleCarrito);
router.put('/modificarCantidad/:idDetalle', DetalleCarritoController.modificarCantidadProducto);



module.exports = router;
