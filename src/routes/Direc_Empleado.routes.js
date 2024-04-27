const express = require("express");
const router = express.Router();
const direc_Empleado = require("../controllers/Direc_Empleado.controller");


// Ruta para obtener todas las direcciones de los clientes
router.get("/TodosEmpleados", direc_Empleado.getAllDirec_Empleado);

module.exports = router;