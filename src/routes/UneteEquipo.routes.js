const express = require("express");
const router = express.Router();
/* const multer = require("multer");
const upload = multer({ dest: "uploads/" }); */
const authController = require('../controllers/UneteEquipo.controller');

router.get("/", authController.getUneteEquipo);
router.post("/agregar-UneteEquipo", authController.createUneteEquipo);
router.put("/actualizar-UneteEquipo/:id", authController.updateUneteEquipo);
router.delete("/eliminar-UneteEquipo/id", authController.deleteUneteEquipo);

module.exports = router;


