const Log = require("../db/models/log/log.model");

// Controlador para obtener todos los clientes
async function getAllLog(req, res) {
  try {
    const Logues = await Log.findAll();
    res.json(Logues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los Logs" });
  }
}

module.exports = {
    getAllLog
};
