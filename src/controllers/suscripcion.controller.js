// suscripcion.controller.js
const webpush = require('web-push');
const Suscripcion = require('../db/models/suscripciones.model');

const crearSuscripcion = async (req, res) => {
  const { endpoint, keys, auth } = req.body;

  try {
    // Verifica si ya existe una suscripción activa para este endpoint
    const suscripcionExistente = await Suscripcion.findOne({
      where: { Endpoint: endpoint, Estado: 'activo' }
    });

    if (suscripcionExistente) {
      // Si la suscripción ya existe, podemos actualizarla (si es necesario)
      await suscripcionExistente.update({
        Keys: JSON.stringify(keys),
        Auth: auth,
        FechaSuscripcion: new Date(),
      });

      return res.status(200).json({ message: 'Suscripción actualizada con éxito', id: suscripcionExistente.IdSuscripcion });
    }

    // Crear una nueva suscripción si no existe una activa
    const nuevaSuscripcion = await Suscripcion.create({
      Endpoint: endpoint,
      Keys: JSON.stringify(keys),
      Auth: auth,
      FechaSuscripcion: new Date(),
      Estado: 'activo'
    });

    // Enviar la notificación a este nuevo suscriptor
    const pushSubscription = {
      endpoint: nuevaSuscripcion.Endpoint,
      keys: JSON.parse(nuevaSuscripcion.Keys),
    };

    const payload = JSON.stringify({
      title: "👓 Bienvenido a Opticenter Huejutla!",
      body: "Gracias por suscribirte. Descubre nuestras ofertas en lentes y servicios de examen visual.",
      icon: "https://res.cloudinary.com/dlrixqhln/image/upload/v1730020914/nz3yhrnx3kufxres1yda.jpg",
      image: "https://res.cloudinary.com/dlrixqhln/image/upload/v1730020914/nz3yhrnx3kufxres1yda.jpg",
      vibrate: [100, 50, 100],
      actions: [
        {
          action: "explore",
          title: "Ver nuestros productos y servicios",
          icon: "https://res.cloudinary.com/dlrixqhln/image/upload/v1730020914/nz3yhrnx3kufxres1yda.jpg",
          url: "https://opticenter-hue.vercel.app/lentes"
        }
      ]
    });

    // Enviar la notificación
    await webpush.sendNotification(pushSubscription, payload);

    res.status(201).json({ message: 'Suscripción creada y notificación enviada con éxito', id: nuevaSuscripcion.IdSuscripcion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear o actualizar la suscripción' });
  }
};

// Controlador para enviar una notificación a todos los suscriptores
/* const enviarNotificacion = async (req, res) => {
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
      title: "👓 Bienvenido a Opticenter Huejutla!",
      body: "Gracias por suscribirte. Descubre nuestras ofertas en lentes y servicios de examen visual.",
      icon: "https://res.cloudinary.com/dlrixqhln/image/upload/v1730020914/nz3yhrnx3kufxres1yda.jpg", // Puedes usar el logo de Opticenter aquí
      image: "https://res.cloudinary.com/dlrixqhln/image/upload/v1730020914/nz3yhrnx3kufxres1yda.jpg", // Imagen representativa o del producto
      vibrate: [100, 50, 100],
      actions: [
        {
          action: "explore",
          title: "Ver nuestros productos y servicios",
          icon: "https://res.cloudinary.com/dlrixqhln/image/upload/v1730020914/nz3yhrnx3kufxres1yda.jpg", // Un ícono representativo para el botón
          url: "https://opticenter-hue.vercel.app/lentes" // URL para redirigir al usuario a la sección de ofertas o servicios
        }
      ]
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
 */
module.exports = {
  crearSuscripcion,
/*   enviarNotificacion */
};
