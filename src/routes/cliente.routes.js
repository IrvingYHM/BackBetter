// cliente.router.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const recuperarController = require('../controllers/recuperar.controller');

// Ruta para obtener todos los clientes
router.get('/', clienteController.getAllClientes);

// Ruta para crear un nuevo cliente
router.post('/', clienteController.createCliente);
router.get('/id/:id', clienteController.getClientePorId);
router.put('/ids/:id', clienteController.updateCliente);


// Ruta para recuperar contraseña
router.post('/recuperar-contrasena', recuperarController.recuperarContrasena);
router.post('/cambiar-contrasena', recuperarController.cambiarContraseña);
router.post("/verificar-respuesta", recuperarController.verificarRespuesta);
router.post("/Enviar_codigo", recuperarController.enviarCodigo);
router.post("/Verificacion_codigo", recuperarController.verificarCodigo);
router.get('/find/:codigoAle', clienteController.findClienteByCodigoAle); // Nueva ruta para buscar cliente por codigoAle
// Ruta para obtener la dirección de un cliente específico por IdCliente
router.get('/clientes/:IdCliente/direccion', clienteController.getDireccionClientePorId);
router.put('/actualizar/:IdCliente/direccion', clienteController.getDireccionClientePorId);
//Para saber la contraseña de la persona
router.post('/clientes/:id/password', clienteController.verifyPassword)
router.post('/:id/password', clienteController.changePassword)



module.exports = router;
