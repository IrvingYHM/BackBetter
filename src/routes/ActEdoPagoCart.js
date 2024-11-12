// ActEdoPagoCart.js

const express = require('express');
const router = express.Router();
const Carrito = require('../db/models/Carrito.model'); 
const { Sequelize } = require('sequelize');
 

router.post('/actualizarEstadoPago', async (req, res) => {
    const { IdCarrito, estado_pago } = req.body;

    try {
        // Verificar si el carrito existe
        const carrito = await Carrito.findOne({
            where: { IdCarrito: IdCarrito },
        });

        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Actualizar el estado de pago
        carrito.estado_pago = estado_pago;
        await carrito.save();

        res.status(200).json({ message: 'Estado de pago actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar estado de pago:', error);
        res.status(500).json({ error: 'Hubo un error al actualizar el estado de pago' });
    }
});

module.exports = router;
