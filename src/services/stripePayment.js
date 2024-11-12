const Stripe = require('stripe');

const stripe = new Stripe('sk_test_51QF7CwP4u0AspHWqDjjXCuH6y35UrUv23YbpSHu84sypT9MCBPhc0BEib94CCORZC7Z3QD3ztm4Pe1mkjXH8wuUG00qSBcRmka'); // Replace with your actual secret key

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'mxn', // Change to your currency
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createPaymentIntent;
