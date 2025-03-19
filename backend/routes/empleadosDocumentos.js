// backend/routes/empleadosDocumentos.js
const express = require("express");
const router = express.Router();
const empleadosDocumentosController = require("../controllers/empleadosDocumentosController");
const authMiddleware = require("../middlewares/authMiddleware");

// Ruta para obtener documentos de un empleado
router.get("/:employeeId", authMiddleware.verifyToken, empleadosDocumentosController.obtenerDocumentosEmpleado);

// Ruta para subir un documento de un empleado
router.post("/", authMiddleware.verifyToken, empleadosDocumentosController.subirDocumentoEmpleado);

// Rutas para aprobar y rechazar documentos de empleados
router.put("/aprobar/:id", authMiddleware.verifyToken, empleadosDocumentosController.aprobarDocumentoEmpleado);
router.put("/rechazar/:id", authMiddleware.verifyToken, empleadosDocumentosController.rechazarDocumentoEmpleado);

module.exports = router;
