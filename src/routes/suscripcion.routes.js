const express = require('express');
const router = express.Router();
const { crearSuscripcion, enviarNotificacion } = require('../controllers/suscripcion.controller');

// Ruta para crear una nueva suscripción
router.post('/suscribirse', crearSuscripcion);

// Ruta para enviar una notificación
/* router.post('/enviar-notificacion', enviarNotificacion); */

module.exports = router;
