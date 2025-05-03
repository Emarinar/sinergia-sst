// backend/src/controllers/studyProgramsController.js
const { poolPromise } = require('../../db');

async function listarStudyPrograms(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM StudyPrograms");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar StudyPrograms:", error);
    res.status(500).json({ error: "Error al listar StudyPrograms." });
  }
}

async function agregarStudyProgram(req, res) {
  const { nombre, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("nombre", nombre);
    request.input("descripcion", descripcion);
    const result = await request.query(`
      INSERT INTO StudyPrograms (Nombre, Descripcion, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@nombre, @descripcion, GETDATE())
    `);
    res.json({ studyProgram: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar StudyProgram:", error);
    res.status(500).json({ error: "Error al agregar StudyProgram." });
  }
}

async function actualizarStudyProgram(req, res) {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id).input("nombre", nombre).input("descripcion", descripcion);
    const result = await request.query(`
      UPDATE StudyPrograms
      SET Nombre=@nombre, Descripcion=@descripcion, UpdatedAt=GETDATE()
      WHERE ID=@id;
      SELECT * FROM StudyPrograms WHERE ID=@id;
    `);
    res.json({ studyProgram: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar StudyProgram:", error);
    res.status(500).json({ error: "Error al actualizar StudyProgram." });
  }
}

async function eliminarStudyProgram(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request().input("id", id).query("DELETE FROM StudyPrograms WHERE ID=@id");
    res.json({ message: "StudyProgram eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar StudyProgram:", error);
    res.status(500).json({ error: "Error al eliminar StudyProgram." });
  }
}

module.exports = {
  listarProgramas: listarStudyPrograms,     // alias para router.get
  agregarPrograma: agregarStudyProgram,     // alias para router.post
  actualizarPrograma: actualizarStudyProgram,
  eliminarPrograma: eliminarStudyProgram
};
