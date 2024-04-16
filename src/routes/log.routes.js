const express = require('express');
const router = express.Router();
const Log = require('../controllers/Log.controller');

// Ruta para obtener todos los clientes
router.get('/Logues', Log.getAllLog)

module.exports = router;
