const express = require("express");
const router = express.Router();
const Feedback = require("../controllers/Feedback.controller");


// Ruta para obtener todas las direcciones de los clientes

/* router.post("/Encuesta/registrarEncuesta", Feedback.registrarEncuesta);
router.put("/Encuesta/actualizarEncuesta", Feedback.actualizarEncuesta); */

router.post("/Encuesta", Feedback.crearEncuesta);
router.get("/Encuesta/completada", Feedback.verificarEncuesta);
router.get("/resultados", Feedback.obtenerResultadosEncuestas);



module.exports = router;