const express = require('express');
const router = express.Router();
const Pedido = require('../controllers/Pedido/Pedido.controller')

// Ruta para obtener todos los pedidos
router.get('/Pedido', Pedido.getAllPedidos)
router.post('/agregar', Pedido.createPedido)
router.post('/crear-completo', Pedido.crearPedidoCompleto)
router.get('/IdPedido',Pedido.VerDetallePedido)
// Ruta para obtener pedidos por cliente ID
router.get('/cliente/:clienteId', Pedido.getPedidosByClienteId)




module.exports = router;
