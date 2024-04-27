const express = require('express');
const router = express.Router();
const Valoracion = require('../controllers/Valoracion.controller');

// Ruta para obtener todos los clientes
router.get('/Valoraciones', Valoracion.getAllValoracion)

module.exports = router;
