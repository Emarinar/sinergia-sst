// controllers/studyProgramsController.js
const db = require("../db");

exports.listarProgramas = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM StudyPrograms");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar programas de estudio:", error);
    res.status(500).json({ error: "Error al listar programas de estudio" });
  }
};

exports.agregarPrograma = async (req, res) => {
  const { titulo, descripcion, grade } = req.body;
  try {
    const query = `
      INSERT INTO StudyPrograms (titulo, descripcion, grade)
      OUTPUT INSERTED.*
      VALUES ('${titulo}', '${descripcion}', '${grade || null}')
    `;
    const result = await db.query(query);
    res.json({ programa: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar programa de estudio:", error);
    res.status(500).json({ error: "Error al agregar programa de estudio" });
  }
};

exports.actualizarPrograma = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, grade } = req.body;
  try {
    const query = `
      UPDATE StudyPrograms
      SET titulo='${titulo}', descripcion='${descripcion}', grade='${grade}'
      WHERE id=${id};
      SELECT * FROM StudyPrograms WHERE id=${id}
    `;
    const result = await db.query(query);
    res.json({ programa: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar programa de estudio:", error);
    res.status(500).json({ error: "Error al actualizar programa de estudio" });
  }
};

exports.eliminarPrograma = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM StudyPrograms WHERE id=${id}`);
    res.json({ message: "Programa de estudio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar programa de estudio:", error);
    res.status(500).json({ error: "Error al eliminar programa de estudio" });
  }
};
