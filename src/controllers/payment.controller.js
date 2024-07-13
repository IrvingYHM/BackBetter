const mercadopago = require('mercadopago');

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
    const { items } = req.body;
    
    // Configura MercadoPago
    mercadopago.configure({
      access_token: "TEST-708692578909054-040704-5d4e1bcb97c7139691b01accd7132957-1758609539",
    });
    
    try {
      const result = await mercadopago.preferences.create({
        items: items,
        back_urls: {
          success: "http://localhost:5173/",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        }, 
        notification_url: "https://79f2-201-97-104-113.ngrok-free.app/webhook",
      });
  
      // Devuelve la URL de inicio de pago en la respuesta
      res.json({ init_point: result.body.init_point });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear la orden');
    }
  };
  

module.exports.receiveWebhook = async(req,res) =>{
    console.log(req.query);
    const payment = req.query

    try {
        if(payment.type === "payment"){
            const data =  await mercadopago.payment.findById(payment['data.id'])
            console.log(data)
          }
          
          res.sendStatus(204)
        
    } catch (error) {
        console.log(error);
        return res.senStatus(500).json({ error: error.message});
    }


}
