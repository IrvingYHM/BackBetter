// cliente.router.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const recuperarController = require('../controllers/recuperar.controller');

// Ruta para obtener todos los clientes
router.get('/', clienteController.getAllClientes);

// Ruta para crear un nuevo cliente
router.post('/', clienteController.createCliente);

// Ruta para recuperar contraseña
router.post('/recuperar-contrasena', recuperarController.recuperarContrasena);

module.exports = router;
