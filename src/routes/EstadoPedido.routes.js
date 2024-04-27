const express = require("express");
const router = express.Router();
const EstadoPedido = require("../controllers/Pedido/EstadoPedido.model");


// Ruta para obtener todas las direcciones de los clientes
router.get("/TodosEstadosPedidos", EstadoPedido.getAllEstadoPedidos);

module.exports = router;