const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  obtenerDocumentosEmpleado,
  subirDocumentoEmpleado,
  aprobarDocumentoEmpleado,
  rechazarDocumentoEmpleado
} = require('../controllers/empleadosDocumentosController');

// Todas las rutas van protegidas
router.use(verifyToken);

// Obtener documentos de un empleado
// GET /api/empleados/documentos/:employeeId
router.get('/:employeeId', obtenerDocumentosEmpleado);

// Subir un documento para un empleado
// POST /api/empleados/documentos/
// (asegúrate de usar multer o similar en server.js antes de estas rutas)
router.post('/', subirDocumentoEmpleado);

// Aprobar documento de empleado
// PUT /api/empleados/documentos/aprobar/:id
router.put('/aprobar/:id', aprobarDocumentoEmpleado);

// Rechazar documento de empleado
// PUT /api/empleados/documentos/rechazar/:id
router.put('/rechazar/:id', rechazarDocumentoEmpleado);

module.exports = router;
