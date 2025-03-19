// backend/controllers/studyProgramsController.js
const { poolPromise } = require("../db");

async function listarStudyPrograms(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM StudyPrograms");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar programas de estudio:", error);
    res.status(500).json({ error: "Error al listar programas de estudio." });
  }
}

async function agregarStudyProgram(req, res) {
  const { nombre, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("nombre", nombre);
    request.input("descripcion", descripcion);
    const query = `
      INSERT INTO StudyPrograms (Nombre, Descripcion, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@nombre, @descripcion, GETDATE())
    `;
    const result = await request.query(query);
    res.json({ studyProgram: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar programa de estudio:", error);
    res.status(500).json({ error: "Error al agregar programa de estudio." });
  }
}

async function actualizarStudyProgram(req, res) {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    request.input("nombre", nombre);
    request.input("descripcion", descripcion);
    const query = `
      UPDATE StudyPrograms
      SET Nombre = @nombre,
          Descripcion = @descripcion,
          UpdatedAt = GETDATE()
      WHERE ID = @id;
      SELECT * FROM StudyPrograms WHERE ID = @id;
    `;
    const result = await request.query(query);
    res.json({ studyProgram: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar programa de estudio:", error);
    res.status(500).json({ error: "Error al actualizar programa de estudio." });
  }
}

async function eliminarStudyProgram(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query("DELETE FROM StudyPrograms WHERE ID = @id");
    res.json({ message: "Programa de estudio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar programa de estudio:", error);
    res.status(500).json({ error: "Error al eliminar programa de estudio." });
  }
}

module.exports = {
  listarStudyPrograms,
  agregarStudyProgram,
  actualizarStudyProgram,
  eliminarStudyProgram,
};
