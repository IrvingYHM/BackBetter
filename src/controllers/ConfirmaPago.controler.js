const stripe = require('stripe')('sk_test_51QF7CwP4u0AspHWqDjjXCuH6y35UrUv23YbpSHu84sypT9MCBPhc0BEib94CCORZC7Z3QD3ztm4Pe1mkjXH8wuUG00qSBcRmka'); // Reemplaza con tu clave secreta real
const Carrito = require('../db/models/Carrito.model');
const tbldetallecarrito = require('../db/models/DetalleCarrito.model'); 

const confirmPaymentIntent = async (req, res) => {
  const { paymentIntentId, carritoId } = req.body;

  try {
    // Confirma el PaymentIntent en el servidor
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
        console.log("IdCarrito antes del UPDATE:", carritoId);
        await tbldetallecarrito.destroy({ where: { IdCarrito: carritoId } });
      // Si el pago fue exitoso, actualiza el estado del carrito
      await Carrito.update(
        { estado_pago: 'aprobado' },
        { where: { IdCarrito: carritoId } }
      );

      return res.json({ success: true, message: 'Pago confirmado y productos eliminados del carrito' });
    } else {
      return res.status(400).json({ message: 'El pago no fue exitoso' });
    }
  } catch (error) {
    console.error('Error al confirmar el pago en el backend:', error);
    res.status(500).json({ success: false, message: 'Error al confirmar el pago' });
  }
};

module.exports = { confirmPaymentIntent };
