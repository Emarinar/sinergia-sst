// backend/routes/reportes.js
const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportesController");
const authMiddleware = require("../middlewares/authMiddleware");

// Ruta para reporte de empresas
router.get("/empresas", authMiddleware.verifyToken, reportesController.reporteEmpresas);

// Ruta para reporte de empleados
router.get("/empleados", authMiddleware.verifyToken, reportesController.reporteEmpleados);

// Ruta para reporte de documentos
router.get("/documentos", authMiddleware.verifyToken, reportesController.reporteDocumentos);

module.exports = router;
