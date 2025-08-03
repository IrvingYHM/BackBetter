const express = require('express');
const router = express.Router();
const authControllerProductos = require('../controllers/Catalogos.controller');

router.get("/", authControllerProductos.getCatalogos); 
router.post("/agregar-catalogo", authControllerProductos.createCatalogo);
router.put("/actualizar-catalogo", authControllerProductos.updateCatalogo); 
router.delete("/eliminar/:id", authControllerProductos.deleteCatalogo);

module.exports = router;
