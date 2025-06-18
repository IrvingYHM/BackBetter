const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const authControllerProductos = require('../controllers/UneteEquipo.controller');

router.get("/", authControllerProductos.getUneteEquipo);
router.post("/agregar-UneteEquipo", authControllerProductos.createUneteEquipo);
router.put("/actualizar-UneteEquipo", authControllerProductos.updateUneteEquipo);
router.delete("/eliminar-UneteEquipo", authControllerProductos.deleteUneteEquipo);

module.exports = router;


