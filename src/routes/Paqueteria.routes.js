const express = require('express');
const router = express.Router();
const Paqueteria = require('../controllers/Pedido/Paqueteria.controller')

// Ruta para obtener todos los clientes
router.get('/TodosPaq', Paqueteria.getAllPaqueterias);


module.exports = router;
