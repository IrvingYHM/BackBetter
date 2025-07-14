const express = require('express');
const router = express.Router();
const authController = require('../controllers/empleado.controller');

// Ruta para iniciar sesión
router.get('/empleado', authController.getAllEmpleado);
router.post('/crear', authController.createEmpleado);
router.post('/login', authController.loginEmpleado); 
router.put("/actualizar/:id", authController.updateEmpleado);
router.patch("/estado/:id", authController.updateEstadoEmpleado);
router.get('/empleado/:id', authController.getEmpleadoById);

module.exports = router;
