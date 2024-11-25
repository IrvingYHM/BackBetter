const express = require("express");
const router = express.Router();
const Feedback = require("../controllers/feedbackMovil.controller");


// Ruta para obtener todas las direcciones de los clientes
router.post("/EncuestaM", Feedback.crearEncuesta);
router.get("/EncuestaM/completada", Feedback.verificarEncuesta);
router.get("/resultadosM", Feedback.obtenerResultadosEncuestas);



module.exports = router;