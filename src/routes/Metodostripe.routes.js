const express = require('express');
const router = express.Router();
const Stripe = require('../controllers/Metodo stripe/Stripe.controller');

// Ruta para obtener todos los clientes
router.post('/checkout', Stripe.handlePayment)

module.exports = router;
