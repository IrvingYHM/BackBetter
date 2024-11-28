const express = require("express");
const router = express.Router();
const Feedback = require("../controllers/feedbackMovil.controller");


// Ruta para obtener todas las direcciones de los clientes
router.post("/EncuestaM", Feedback.crearEncuesta);
router.get("/EncuestaM/completada", Feedback.verificarEncuesta);
router.post("/guardarEncuestaPendientes", Feedback.guardarEncuestaPendiente);
router.get("/resultadosM", Feedback.obtenerResultadosEncuestas);
router.put("/RegistroE", Feedback.completarEncuesta);
router.post("/verificaE", Feedback.registrarAccesoFeedback)
router.post("/obtenerEncuestaPendiente", Feedback.obtenerEncuestaPendiente);





module.exports = router;
