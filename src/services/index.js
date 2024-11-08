/* // server/index.js
const express = require('express');
const webpush = require('./webPush');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let suscripciones = []; // Puedes almacenarlo en la memoria o una base de datos

app.post('/api/suscribirse', (req, res) => {
  const subscription = req.body;
  suscripciones.push(subscription);
  res.status(201).json({});
});

app.post('/api/agregar-producto', (req, res) => {
  const payload = JSON.stringify({
    title: 'Producto agregado',
    body: 'Has agregado un producto al carrito.',
    icon: '/icon.png',
  });

  suscripciones.forEach(subscription => {
    webpush.sendNotification(subscription, payload).catch(error => {
      console.error('Error al enviar notificación:', error);
    });
  });

  res.status(200).json({ message: 'Producto agregado y notificación enviada.' });
});
 */