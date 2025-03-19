// backend/routes/empresas.js
const express = require("express");
const router = express.Router();
const empresasController = require("../controllers/empresasController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Ruta pública para listar empresas (útil para el registro de usuarios)
router.get("/", empresasController.listarEmpresas);

// Rutas protegidas para operaciones de creación, actualización y eliminación
router.post("/", verifyToken, empresasController.agregarEmpresa);
router.put("/:id", verifyToken, empresasController.actualizarEmpresa);
router.delete("/:id", verifyToken, empresasController.eliminarEmpresa);

module.exports = router;
