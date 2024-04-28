const express = require('express');
const router = express.Router();
const Cita = require('../controllers/Citas/Citas.controller');


// Ruta para obtener todos los clientes
router.get('/TodasCitas', Cita.getAllCitas)



module.exports = router;
