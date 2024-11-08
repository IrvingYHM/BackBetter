const Suscripcion = require('../db/models/suscripciones.model');  // Asegúrate de que la ruta sea correcta

const guardarSuscripcionEnBD = async (suscripcion) => {
    try {
      await Suscripcion.create({
        Endpoint: suscripcion.endpoint,  // Endpoint de la suscripción
        Keys: JSON.stringify(suscripcion.keys),  // Las claves deben estar en formato JSON
        Auth: suscripcion.auth,  // Clave de autenticación
        FechaSuscripcion: new Date(),  // Fecha de la suscripción
        Estado: 'activo'  // Estado por defecto 'activo'
      });
      console.log("Suscripción guardada correctamente");
    } catch (error) {
      console.error("Error al guardar la suscripción en la base de datos: ", error);
    }
  };

// Exportamos la función para que se pueda utilizar en otros archivos
module.exports = {
  guardarSuscripcionEnBD
};
