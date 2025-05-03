// backend/src/routes/empresas.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  listarEmpresas,
  registrarEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
} = require('../controllers/empresasController');

// Rutas públicas
router.post('/', registrarEmpresa);

// Rutas protegidas
router.use(verifyToken);

router.get('/', listarEmpresas);
router.put('/:id', actualizarEmpresa);
router.delete('/:id', eliminarEmpresa);

module.exports = router;
