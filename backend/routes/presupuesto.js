// backend/routes/presupuesto.js
const express = require("express");
const router = express.Router();
const presupuestoController = require("../controllers/presupuestoController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Proteger las rutas con el middleware de autenticación
router.get("/", verifyToken, presupuestoController.listarGastos);
router.post("/", verifyToken, presupuestoController.agregarGasto);

// Puedes agregar PUT o DELETE si deseas actualizar o eliminar gastos

module.exports = router;
