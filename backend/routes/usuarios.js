// backend/routes/usuarios.js
const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rutas para usuarios
router.get("/", authMiddleware.verifyToken, usuariosController.listarUsuarios);
router.post("/register", usuariosController.registrarUsuario);
router.post("/login", usuariosController.login);
router.put("/:id", authMiddleware.verifyToken, usuariosController.actualizarUsuario);
router.delete("/:id", authMiddleware.verifyToken, usuariosController.eliminarUsuario);

module.exports = router;
