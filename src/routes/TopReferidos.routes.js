const express = require("express");
const router = express.Router();
const authController = require("../controllers/TopReferidos.controller");

// Ruta para iniciar sesión
router.get("/", authController.getTopReferidos);
router.post("/nuevo-top", authController.createTopReferidos);
router.put("/actualizarTop/:id", authController.updateTopReferidos);
router.patch("/eliminar/:id", authController.deleteTopReferidos);

module.exports = router;
