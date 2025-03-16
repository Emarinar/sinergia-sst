// backend/routes/plantillas.js
const express = require("express");
const router = express.Router();
const plantillasController = require("../controllers/plantillasController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, plantillasController.listarPlantillas);
router.post("/", authMiddleware.verifyToken, plantillasController.crearPlantilla);
router.put("/:id", authMiddleware.verifyToken, plantillasController.actualizarPlantilla);
router.delete("/:id", authMiddleware.verifyToken, plantillasController.eliminarPlantilla);
router.get("/generar-pdf/:id", authMiddleware.verifyToken, plantillasController.generarPDF);

module.exports = router;
