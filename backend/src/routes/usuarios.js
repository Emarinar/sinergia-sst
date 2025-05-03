const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  listarUsuarios,
  registrarUsuario,
  login,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuariosController');

// Rutas públicas
router.post('/login', login);
router.post('/', registrarUsuario);

// A partir de aquí, todas requieren token
router.use(verifyToken);
router.get('/', listarUsuarios);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;
