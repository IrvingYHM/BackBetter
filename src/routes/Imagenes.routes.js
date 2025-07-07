const express = require('express');
const router = express.Router();
const authController = require('../controllers/Imagenes.controller');

router.post("/agregar-imagen", authController.createImagen);
router.delete("/eliminar-imagen", authController.deleteImagen);
router.get("/filtrar/:tipo", authController.getImagenesByTipo);
router.put("/actualizar/:id", authController.updateImagen);

module.exports = router;