// routes/auditorias.js
const express = require("express");
const router = express.Router();
const auditoriasController = require("../controllers/auditoriasController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, auditoriasController.listarAuditorias);
router.post("/", authMiddleware.verifyToken, auditoriasController.agregarAuditoria);
router.put("/:id", authMiddleware.verifyToken, auditoriasController.actualizarAuditoria);
router.delete("/:id", authMiddleware.verifyToken, auditoriasController.eliminarAuditoria);

module.exports = router;
