const express = require('express');
const router = express.Router();
const Tratamiento = require('../controllers/Detalle_carrito/Tratamiento.controller');

// Ruta para obtener todos los clientes
router.get('/Tratamiento', Tratamiento.getAllTratamiento)

module.exports = router;
