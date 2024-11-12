const express = require('express');
const router = express.Router();
const Pedido = require('../controllers/Pedido/Pedido.controller')

// Ruta para obtener todos los clientes
router.get('/Pedido', Pedido.getAllPedidos)
router.post('/agregar', Pedido.createPedido)
router.get('/IdPedido',Pedido.getPedidoId)




module.exports = router;
