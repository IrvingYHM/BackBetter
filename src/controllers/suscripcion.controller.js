// suscripcion.controller.js
const webpush = require('web-push');
const Suscripcion = require('../db/models/suscripciones.model');

// Controlador para crear una nueva suscripción
const crearSuscripcion = async (req, res) => {
  const { endpoint, keys, auth } = req.body;

  try {
    // Crear la nueva suscripción en la base de datos
    const nuevaSuscripcion = await Suscripcion.create({
      Endpoint: endpoint,
      Keys: JSON.stringify(keys), // Guardamos las claves como un string
      Auth: auth,
      FechaSuscripcion: new Date(),
      Estado: 'activo' // Puedes cambiar el estado dependiendo del flujo
    });

    res.status(201).json({ message: 'Suscripción creada con éxito', id: nuevaSuscripcion.IdSuscripcion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la suscripción' });
  }
};

// Controlador para enviar una notificación a todos los suscriptores
const enviarNotificacion = async (req, res) => {
  try {
    // Obtén todas las suscripciones activas desde la base de datos
    const suscripciones = await Suscripcion.findAll({
      where: { Estado: 'activo' }
    });

    if (!suscripciones.length) {
      return res.status(404).json({ message: 'No hay suscriptores activos' });
    }

    // Payload de la notificación (puedes personalizarlo)
    const payload = JSON.stringify({
      notification: {
        title: "😋🍔🍕 Bienvenido a QuickDineHub!🍲🥣🍤",
        body: "Gracias por suscribirte. Descubre los platillos más deliciosos.",
        icon: "https://res.cloudinary.com/dnzbkzkrp/image/upload/v1731285748/jh3vyvlbcscpdl9muco3.png",
        image: "https://res.cloudinary.com/dnzbkzkrp/image/upload/v1731285748/jh3vyvlbcscpdl9muco3.png",
        vibrate: [100, 50, 100],
        actions: [{
          action: "explore",
          title: "Ver nuestras especialidades",
          url: "https://quickdinehub-front1.web.app/login-clientes"
        }]
      }
    });

    // Envía la notificación a cada suscriptor
    for (const suscripcion of suscripciones) {
      const pushSubscription = {
        endpoint: suscripcion.Endpoint,
        keys: JSON.parse(suscripcion.Keys), // Asegúrate de parsear las claves
      };

      // Enviar la notificación
      await webpush.sendNotification(pushSubscription, payload);
    }

    res.status(200).json({ message: 'Notificación enviada a todos los suscriptores' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar la notificación' });
  }
};

module.exports = {
  crearSuscripcion,
  enviarNotificacion
};
