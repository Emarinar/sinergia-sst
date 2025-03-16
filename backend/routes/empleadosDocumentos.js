const express = require("express");
const router = express.Router();
const empleadosDocumentosController = require("../controllers/empleadosDocumentosController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rutas existentes para empleados
router.get("/documentos/:employeeId", authMiddleware.verifyToken, empleadosDocumentosController.obtenerDocumentosEmpleado);
router.post("/documentos", authMiddleware.verifyToken, empleadosDocumentosController.subirDocumentoEmpleado);

// Nuevas rutas para aprobar/rechazar documentos de empleados
router.put("/documentos/aprobar/:id", authMiddleware.verifyToken, empleadosDocumentosController.aprobarDocumentoEmpleado);
router.put("/documentos/rechazar/:id", authMiddleware.verifyToken, empleadosDocumentosController.rechazarDocumentoEmpleado);

module.exports = router;
