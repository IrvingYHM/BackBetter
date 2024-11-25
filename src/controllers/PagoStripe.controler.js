const Stripe = require('stripe');
const Carrito = require('../db/models/Carrito.model')
const stripe = new Stripe('sk_test_51QF7CwP4u0AspHWqDjjXCuH6y35UrUv23YbpSHu84sypT9MCBPhc0BEib94CCORZC7Z3QD3ztm4Pe1mkjXH8wuUG00qSBcRmka'); // Reemplaza con tu clave secreta real

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Monto en centavos (por ejemplo, 1000 = 10.00 unidades de la moneda)
      currency: 'mxn', // Cambia a tu moneda preferida
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };
