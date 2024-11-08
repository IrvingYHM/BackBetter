// src/routes/Cita.routes.js
const express = require("express");
const router = express.Router();
const citaController = require("../controllers/Citas/Citas.controller");

// Ruta para obtener todas las citas
router.get("/", citaController.getCitas);

// Ruta para obtener una cita por ID
router.get("/:id", citaController.getCitaById);

// Ruta para obtener citas por ID de usuario
router.get("/usuario/:idCliente", citaController.getCitasByUserId);

// Ruta para crear una nueva cita
router.post("/", citaController.createCita);

// Ruta para actualizar una cita por ID
router.put("/:id", citaController.updateCita);

// Ruta para cancelar una cita por ID
router.put("/cancelar/:id", citaController.cancelarCita);

// Ruta para verificar disponibilidad de horarios
router.post("/check-availability", citaController.checkAvailability);

module.exports = router;
