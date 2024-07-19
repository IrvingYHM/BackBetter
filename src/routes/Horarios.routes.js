const express = require("express");
const router = express.Router();
const {
  getHorariosDisponibles,
  getHorariosPorFecha,
  reservarHorario,
  getHorarioById,
  createHorario,
  updateHorario,
  deleteHorario,
} = require("../controllers/Citas/Horarios.controller");

router.get("/", getHorariosDisponibles);
router.get('/HrPorFecha', getHorariosPorFecha);
router.post("/reservar", reservarHorario);
router.get("/:id", getHorarioById);
router.post("/", createHorario);
router.put("/:id", updateHorario);
router.delete("/:id", deleteHorario);

module.exports = router;
