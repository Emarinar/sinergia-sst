const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const empleadosController = require('../controllers/empleadosController');

router.use(verifyToken);
router.get('/', empleadosController.listarEmpleados);
router.post('/', empleadosController.agregarEmpleado);
router.put('/:id', empleadosController.actualizarEmpleado);
router.delete('/:id', empleadosController.eliminarEmpleado);

module.exports = router;
