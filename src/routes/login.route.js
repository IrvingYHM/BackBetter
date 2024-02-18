const express = require('express');
const router = express.Router();
const authController = require('../controllers/login.controller');

// Ruta para iniciar sesión
router.post('/login', authController.login); // Utilizar el método login del controlador de autenticación

module.exports = router;
