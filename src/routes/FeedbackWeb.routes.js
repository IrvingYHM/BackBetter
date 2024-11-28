const express = require("express");
const router = express.Router();
const Feedback = require("../controllers/feedback/feeback.controller");


// Ruta para obtener todas las direcciones de los clientes

/* router.post("/Encuesta/registrarEncuesta", Feedback.registrarEncuesta);
router.put("/Encuesta/actualizarEncuesta", Feedback.actualizarEncuesta); */

router.post("/feedback/acceso", Feedback.registrarAccesoFeedback);
router.put("/feedback/completar", Feedback.completarEncuesta);
router.post("/feedback/pendiente", Feedback.obtenerEncuestaPendiente);
router.get("/feedback/obtenerResultadosEncuestas", Feedback.obtenerResultadosEncuestas);






module.exports = router;