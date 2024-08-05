const mercadopago = require("mercadopago");
const Carrito = require("../db/models/Carrito.model");

// Variable global para almacenar el ID de la orden
let lastOrderId = null;
/* module.exports.createOrder = async (req, res) => {
    mercadopago.configure({
        access_token: "TEST-708692578909054-040704-5d4e1bcb97c7139691b01accd7132957-1758609539",
    });
    try {
        const result = await mercadopago.preferences.create({
            items: [
                {
                    title: "Laptop lenovo",
                    unit_price: 100,
                    currency_id: "MXN",
                    quantity: 1,
                }
            ],
            back_urls:{
                success: "http://localhost:3000/success",
                failure: "http://localhost:3000/failure",
                pending: "http://localhost:3000/pending",
            }, 
            notification_url: "https://6463-2806-10a6-10-9d3a-52c-7fea-638c-5310.ngrok-free.app/webhook",

        });
        console.log(result);

        res.send(result.body);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la orden');
    }
};
 */

module.exports.createOrder = async (req, res) => {
  const { items, clienteId } = req.body;

  // Asigna el clienteId a la variable global
  lastOrderId = clienteId;
  console.log("Received Cliente ID:", lastOrderId); // Verifica que clienteId no sea undefined

  // Configura MercadoPago
  mercadopago.configure({
    access_token:
      "TEST-708692578909054-040704-5d4e1bcb97c7139691b01accd7132957-1758609539",
  });

  try {
    const result = await mercadopago.preferences.create({
      items: items,
      back_urls: {
        success: `http://localhost:5173/PaginaSuccess`,
        failure: "http://localhost:5173/PaginaSuccess",
        pending: "http://localhost:3000/pending",
      },
      notification_url: "https://d210-201-97-78-13.ngrok-free.app/webhook",
    });

    // Devuelve la URL de inicio de pago en la respuesta
    res.json({ init_point: result.body.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear la orden");
  }
};

module.exports.receiveWebhook = async (req, res) => {
  console.log(req.query);
  const payment = req.query;

  try {
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);
      console.log(data);

      // Obtener el estado del pago desde la respuesta de Mercado Pago
      const estadoPago = data.body.status === 'approved' ? 'aprobado' : 'pendiente';

      // Busca el cliente en la base de datos usando el lastOrderId
      const carrito = await Carrito.findOne({
        where: { IdCliente: lastOrderId },
      });

      if (carrito) {
        // Actualiza el estado_pago del carrito
        carrito.estado_pago = estadoPago;
        await carrito.save();

        console.log("Cliente encontrado en el carrito.");
        res.json({ message: "Cliente encontrado en el carrito." });
      } else {
        console.log("Cliente no encontrado en el carrito.");
        res
          .status(404)
          .json({ message: "Cliente no encontrado en el carrito." });
      }
    } else {
      res.status(400).json({ message: "Tipo de pago no soportado." });
    }
  } catch (error) {
    console.log(error);
    return res.senStatus(500).json({ error: error.message });
  }
};
