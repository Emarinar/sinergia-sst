const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const formulariosController = require('../controllers/formulariosController');
const respuestasController = require('../controllers/respuestasController');

// Público: ver y responder sin login
router.get('/public/:id', formulariosController.getOne);
router.post('/public/:id/responder', respuestasController.submit);
router.get('/public/:id/export', respuestasController.export);

// Protegidas
router.use(verifyToken);
router.get('/', formulariosController.getAll);
router.get('/:id', formulariosController.getOne);
router.post('/', formulariosController.create);
router.put('/:id', formulariosController.update);
router.delete('/:id', formulariosController.delete);

// Respuestas protegidas
router.get('/:id/respuestas', respuestasController.list);
router.post('/:id/responder', respuestasController.submit);
router.get('/:id/export', respuestasController.export);

module.exports = router;
