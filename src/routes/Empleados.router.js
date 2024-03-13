const express = require('express');
const router = express.Router();
const authController = require('../controllers/empleado.controller');

// Ruta para iniciar sesión
router.get('/empleado', authController.getAllEmpleado); // Utilizar el método login del controlador de autenticación
router.post('/crear', authController.createEmpleado); // Utilizar el método login del controlador de autenticación
router.post('/login', authController.loginEmpleado); // Utilizar el método login del controlador de autenticación

module.exports = router;
