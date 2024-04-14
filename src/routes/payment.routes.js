const { Router } = require("express");
const {createOrder} = require('../controllers/payment.controller')

const router = Router();

router.get('/create-order', createOrder);

router.get('/success', (req, res) => res.send('order created successfully'));

router.get('/webhook', (req, res) => res.send('webhook'));

module.exports = router;
