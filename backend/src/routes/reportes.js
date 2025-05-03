const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const reportesController = require('../controllers/reportesController');

router.use(verifyToken);
router.get('/empresas', reportesController.reporteEmpresas);
router.get('/empleados', reportesController.reporteEmpleados);
router.get('/documentos', reportesController.reporteDocumentos);

module.exports = router;
