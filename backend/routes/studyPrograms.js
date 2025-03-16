// routes/studyPrograms.js
const express = require("express");
const router = express.Router();
const studyProgramsController = require("../controllers/studyProgramsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, studyProgramsController.listarProgramas);
router.post("/", authMiddleware.verifyToken, studyProgramsController.agregarPrograma);
router.put("/:id", authMiddleware.verifyToken, studyProgramsController.actualizarPrograma);
router.delete("/:id", authMiddleware.verifyToken, studyProgramsController.eliminarPrograma);

module.exports = router;
