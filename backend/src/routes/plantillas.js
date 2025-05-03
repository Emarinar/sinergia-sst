const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const plantillasController = require('../controllers/plantillasController');

router.use(verifyToken);
router.get('/', plantillasController.listarPlantillas);
router.post('/', plantillasController.crearPlantilla);
router.put('/:id', plantillasController.actualizarPlantilla);
router.delete('/:id', plantillasController.eliminarPlantilla);
router.get('/generar-pdf/:id', plantillasController.generarPDF);

module.exports = router;
