const express = require("express");
const router = express.Router();
const DetallePedido = require("../controllers/Pedido/DetallePedido.controller");

// Ruta para obtener todos los clientes
router.get("/TodosDetalles", DetallePedido.VerDetallePedido);
router.post("/crear", DetallePedido.createDetallePedido);



module.exports = router; 
