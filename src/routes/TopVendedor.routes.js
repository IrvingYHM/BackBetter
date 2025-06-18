const express = require("express");
const router = express.Router();
const authController = require("../controllers/TopVendedor.controller");

// Ruta para iniciar sesión
router.get("/", authController.getTopVendedores);
router.post("/nuevo-top", authController.createTopVendedor);
router.put("/actualizarTop/:id", authController.updateTopVendedor);
router.patch("/eliminar/:id", authController.deleteTopVendedor);

module.exports = router;
