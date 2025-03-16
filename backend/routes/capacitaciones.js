// routes/capacitaciones.js
const express = require("express");
const router = express.Router();
const capacitacionesController = require("../controllers/capacitacionesController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, capacitacionesController.listarCapacitaciones);
router.post("/", authMiddleware.verifyToken, capacitacionesController.agregarCapacitacion);
router.put("/:id", authMiddleware.verifyToken, capacitacionesController.actualizarCapacitacion);
router.delete("/:id", authMiddleware.verifyToken, capacitacionesController.eliminarCapacitacion);

module.exports = router;
