const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const authMiddleware = require("../middlewares/authMiddleware");

// Endpoint de login (no protegido)
router.post("/login", usuariosController.login);

// Endpoint de registro (protegido, se asume que solo el admin puede registrar nuevos usuarios)
router.post("/register", authMiddleware.verifyToken, usuariosController.register);

// Otros endpoints
router.get("/", authMiddleware.verifyToken, usuariosController.listarUsuarios);
router.put("/:id", authMiddleware.verifyToken, usuariosController.actualizarUsuario);
router.delete("/:id", authMiddleware.verifyToken, usuariosController.eliminarUsuario);

module.exports = router;
