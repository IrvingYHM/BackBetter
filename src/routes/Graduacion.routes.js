const express = require('express');
const router = express.Router();
const Graduacion = require('../controllers/Detalle_carrito/Graduacion.controller');

// Ruta para obtener todos los clientes
router.get('/graduaciones', Graduacion.getAllGraduacion)

module.exports = router;
