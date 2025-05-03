const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const documentosController = require('../controllers/documentosController');

router.use(verifyToken);
router.get('/', documentosController.listarDocumentos);
router.post('/subir', documentosController.subirDocumento);
router.delete('/:id', documentosController.eliminarDocumento);
router.put('/aprobar/:id', documentosController.aprobarDocumento);
router.put('/rechazar/:id', documentosController.rechazarDocumento);

module.exports = router;
