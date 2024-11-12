const express = require('express');
const router = express.Router();
const Pedido = require('../controllers/Pedido/Pedido.controller')

// Ruta para obtener todos los clientes
router.get('/Pedido', Pedido.getAllPedidos)
router.post('/agregar', Pedido.createPedido)
router.get('/IdPedido',Pedido.getPedidoId)

<<<<<<< HEAD



=======
>>>>>>> 838f72329a4899ed608fa625dfdb879c98c8ac9f
module.exports = router;
