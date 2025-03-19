// backend/routes/usuarios.js
const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// Asegúrate de que las funciones estén correctamente exportadas en usuariosController.js
router.get("/", usuariosController.listarUsuarios);
router.post("/register", usuariosController.registrarUsuario);
router.post("/login", usuariosController.login); // Si tienes login
router.put("/:id", usuariosController.actualizarUsuario);
router.delete("/:id", usuariosController.eliminarUsuario);

module.exports = router;
