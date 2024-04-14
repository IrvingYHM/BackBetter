// cliente.router.js
const express = require('express');
const router = express.Router();
const DetalleCarritoController = require('../controllers/DetalleCarrito.controller');

// Ruta para obtener todos los clientes
router.get('/', DetalleCarritoController.VerDetalleCarrito);
router.post('/crear', DetalleCarritoController.createDetalleCarrito);


// Ruta para crear un nuevo cliente
/* router.post('/', clienteController.createCliente); */


module.exports = router;
