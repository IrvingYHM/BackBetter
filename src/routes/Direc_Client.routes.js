const express = require("express");
const router = express.Router();
const direc_ClientController = require("../controllers/Direc_Client.controller");

// Ruta para obtener todas las direcciones de los clientes
router.get("/", direc_ClientController.getAllDirec_Clientes);
/* router.get("/cliente/", direc_ClientController.findClienteByDireccion); */



// Ruta para crear una nueva dirección de cliente
router.post("/", direc_ClientController.createDirec_Client);

module.exports = router;
