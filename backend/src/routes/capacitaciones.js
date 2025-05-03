const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const capacitacionesController = require('../controllers/capacitacionesController');

router.use(verifyToken);
router.get('/', capacitacionesController.listarCapacitaciones);
router.post('/', capacitacionesController.agregarCapacitacion);
router.put('/:id', capacitacionesController.actualizarCapacitacion);
router.delete('/:id', capacitacionesController.eliminarCapacitacion);

module.exports = router;
