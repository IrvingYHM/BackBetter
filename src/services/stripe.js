const express = require('express');
const stripe = require('stripe')('sk_test_51QF7CwP4u0AspHWqDjjXCuH6y35UrUv23YbpSHu84sypT9MCBPhc0BEib94CCORZC7Z3QD3ztm4Pe1mkjXH8wuUG00qSBcRmka'); // Reemplaza con tu clave secreta

app.post('/stripe', async (req, res) => {
    const { line_items } = req.body; // Obteniendo line_items del body de la solicitud

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items, // Usar line_items recibidos
            mode: 'payment',
            success_url: 'http://localhost:3000/success', // URL de éxito
            cancel_url: 'http://localhost:3000/cancel', // URL de cancelación
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
