const express = require("express");
const router = express.Router();
const EstadoEnvio = require("../controllers/Pedido/EstadoEnvio.model");


// Ruta para obtener todas las direcciones de los clientes
router.get("/TodosEstadosEnvios", EstadoEnvio.getAllEstadoEnvios);

module.exports = router;