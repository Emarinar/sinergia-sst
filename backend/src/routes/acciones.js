// backend/src/routes/acciones.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const accionesController = require('../controllers/accionesController');

router.use(auth);

// Listar acciones de una auditoría
router.get('/:auditoriaId/acciones', accionesController.listarAcciones);

// Crear nueva acción
router.post('/:auditoriaId/acciones', accionesController.crearAccion);

// Actualizar acción existente
router.put('/acciones/:id', accionesController.actualizarAccion);

// Eliminar acción
router.delete('/acciones/:id', accionesController.eliminarAccion);

module.exports = router;
