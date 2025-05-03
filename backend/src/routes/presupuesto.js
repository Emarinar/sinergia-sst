const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const presupuestoController = require('../controllers/presupuestoController');

router.use(verifyToken);
router.get('/', presupuestoController.listarGastos);
router.post('/', presupuestoController.agregarGasto);

module.exports = router;
