const express = require('express');
const router = express.Router();
const authControllerProductos = require('../controllers/Slider.controller');

router.get("/", authControllerProductos.getSliders);
router.post("/agregar-Slider", authControllerProductos.createSlider);
router.put("/actualizar-Slider", authControllerProductos.updateSlider); 
router.delete("/eliminar-Slider", authControllerProductos.deleteSlider);

module.exports = router;