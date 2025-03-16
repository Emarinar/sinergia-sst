const express = require("express");
const router = express.Router();
const empresasController = require("../controllers/empresasController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, empresasController.listarEmpresas);
router.post("/", authMiddleware.verifyToken, empresasController.agregarEmpresa);
router.put("/:id", authMiddleware.verifyToken, empresasController.actualizarEmpresa);
router.delete("/:id", authMiddleware.verifyToken, empresasController.eliminarEmpresa);

module.exports = router;
