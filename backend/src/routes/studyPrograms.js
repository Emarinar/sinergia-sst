const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const studyProgramsController = require('../controllers/studyProgramsController');

router.use(verifyToken);
router.get('/', studyProgramsController.listarStudyPrograms);
router.post('/', studyProgramsController.agregarStudyProgram);
router.put('/:id', studyProgramsController.actualizarStudyProgram);
router.delete('/:id', studyProgramsController.eliminarStudyProgram);

module.exports = router;
