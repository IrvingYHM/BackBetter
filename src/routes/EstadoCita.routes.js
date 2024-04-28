const express = require('express');
const router = express.Router();
const EstadoCita = require('../controllers/Citas/EstadoCitas.controller');


// Ruta para obtener todos los clientes
router.get('/TodasEstadoCitas', EstadoCita.getAllEstadoCitas)



module.exports = router;
