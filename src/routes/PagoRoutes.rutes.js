const express = require('express');
const router = express.Router();
const {createPaymentIntent } = require('../controllers/PagoStripe.controler');
const {confirmPaymentIntent} = require('../controllers/ConfirmaPago.controler')

// Ruta para crear un PaymentIntent
router.post('/create-payment-intent', createPaymentIntent);

// Confirmar PaymentIntent
router.post('/confirm-payment-intent', confirmPaymentIntent);

module.exports = router;
