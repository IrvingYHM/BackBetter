const express = require('express');
const router = express.Router();
const authControllerProductos = require('../controllers/Categoria.controller');

router.get("/", authControllerProductos.getCategorias);
router.get("/:id", authControllerProductos.getCategoriaById); 
router.post("/agregar-categoria", authControllerProductos.createCategoria);
router.put("/actualizar-categoria", authControllerProductos.updateCategoria); 
router.delete("/eliminar-categoria", authControllerProductos.deleteCategoria);

module.exports = router;