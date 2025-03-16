// routes/empleados.js
const express = require("express");
const router = express.Router();
const empleadosController = require("../controllers/empleadosController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, empleadosController.listarEmpleados);
router.post("/", authMiddleware.verifyToken, empleadosController.agregarEmpleado);
router.put("/:id", authMiddleware.verifyToken, empleadosController.actualizarEmpleado);
router.delete("/:id", authMiddleware.verifyToken, empleadosController.eliminarEmpleado);

module.exports = router;
