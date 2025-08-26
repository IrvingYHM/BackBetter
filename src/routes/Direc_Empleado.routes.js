const express = require("express");
const router = express.Router();
const direc_Empleado = require("../controllers/Direc_Empleado.controller");


// Ruta para obtener todas las direcciones de los clientes
router.get("/TodosEmpleados", direc_Empleado.getAllDirec_Empleado);

// Ruta para crear una nueva dirección de cliente
router.post("/", direc_Empleado.createDirec_Empleado);

// Ruta para actualizar una dirección de cliente
router.put("/:IdDirec_Empleado", direc_Empleado.updateDirec_Empleado);

module.exports = router;