const express = require("express");
const router = express.Router();
const documentosController = require("../controllers/documentosController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rutas existentes…
router.get("/", authMiddleware.verifyToken, documentosController.listarDocumentos);
router.post("/subir", authMiddleware.verifyToken, documentosController.subirDocumento);
router.delete("/eliminar/:id", authMiddleware.verifyToken, documentosController.eliminarDocumento);

// Nuevas rutas para aprobar/rechazar
router.put("/aprobar/:id", authMiddleware.verifyToken, documentosController.aprobarDocumento);
router.put("/rechazar/:id", authMiddleware.verifyToken, documentosController.rechazarDocumento);

module.exports = router;
