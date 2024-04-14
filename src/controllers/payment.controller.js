const mercadopago = require('mercadopago');

module.exports.createOrder = async (req, res) => {
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
            ]
        });
        console.log(result);
        res.send('creando order');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la orden');
    }
};
