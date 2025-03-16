const express = require("express");
const router = express.Router();
const plantillasController = require("../controllers/plantillasController");
const authMiddleware = require("../middlewares/authMiddleware");

// Ruta para listar plantillas (opcional, puedes filtrar por empresa si es necesario)
router.get("/", authMiddleware.verifyToken, plantillasController.listarPlantillas);

// Ruta para crear una nueva plantilla
router.post("/", authMiddleware.verifyToken, plantillasController.crearPlantilla);

// Ruta para actualizar una plantilla
router.put("/:id", authMiddleware.verifyToken, plantillasController.actualizarPlantilla);

// Ruta para eliminar una plantilla
router.delete("/:id", authMiddleware.verifyToken, plantillasController.eliminarPlantilla);

// Ruta para generar PDF a partir de una plantilla
router.get("/generar-pdf/:id", authMiddleware.verifyToken, plantillasController.generarPDF);

module.exports = router;
