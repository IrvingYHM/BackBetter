const express = require('express');
const router = express.Router();
const TipoCita = require('../controllers/Citas/TipoCitas.controller');


// Ruta para obtener todos los clientes
router.get('/TodasTipoCitas', TipoCita.getAllTipoCitas)



module.exports = router;
