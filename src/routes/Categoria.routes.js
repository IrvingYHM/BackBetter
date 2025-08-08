const express = require('express');
const router = express.Router();
const authControllerProductos = require('../controllers/Categoria.controller');

router.get("/", authControllerProductos.getCategorias);
router.get("/:id", authControllerProductos.getCategoriaById); 
router.get("/check-products/:id", authControllerProductos.checkCategoriaProducts);
router.post("/agregar-categoria", authControllerProductos.createCategoria);
router.put("/actualizar-categoria/:id", authControllerProductos.updateCategoria); 
router.delete("/eliminar-categoria/:id", authControllerProductos.deleteCategoria);

module.exports = router;