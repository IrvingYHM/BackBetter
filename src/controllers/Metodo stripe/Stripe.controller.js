const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Pesw4FaQ2Q5P9TkgU4YYVRR274tKl0iW6s4uMRvFZVUozOBr0OzBr1b9SDGxoW1Z3yRUlZwe7Ptbtwd41aWPdKn00elxPcinv');

async function handlePayment(req, res) {
  try {
    const { id, amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: 'Teclado gaming',
      payment_method: id,
      confirm: true,
      return_url: 'http://localhost:3000/success', // URL a la que redirigir después del pago
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Payment failed', error });
  }
}

module.exports = {
  handlePayment,
};
