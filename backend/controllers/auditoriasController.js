// controllers/auditoriasController.js
const db = require("../db");

exports.listarAuditorias = async (req, res) => {
  const { fecha, responsable, estado } = req.query;
  let filtro = "";
  if (fecha) filtro += ` AND fecha = '${fecha}'`;
  if (responsable) filtro += ` AND responsable LIKE '%${responsable}%'`;
  if (estado) filtro += ` AND estado = '${estado}'`;
  try {
    const query = `SELECT * FROM Auditorias WHERE 1=1 ${filtro}`;
    const result = await db.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar auditorías:", error);
    res.status(500).json({ error: "Error al listar auditorías" });
  }
};

exports.agregarAuditoria = async (req, res) => {
  const { fecha, responsable, estado, hallazgos, planAccion } = req.body;
  try {
    const query = `
      INSERT INTO Auditorias (fecha, responsable, estado, hallazgos, planAccion)
      OUTPUT INSERTED.*
      VALUES ('${fecha}', '${responsable}', '${estado}', '${hallazgos}', '${planAccion}')
    `;
    const result = await db.query(query);
    res.json({ auditoria: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar auditoría:", error);
    res.status(500).json({ error: "Error al agregar auditoría" });
  }
};

exports.actualizarAuditoria = async (req, res) => {
  const { id } = req.params;
  const { fecha, responsable, estado, hallazgos, planAccion } = req.body;
  try {
    const query = `
      UPDATE Auditorias
      SET fecha='${fecha}', responsable='${responsable}', estado='${estado}', hallazgos='${hallazgos}', planAccion='${planAccion}'
      WHERE ID=${id};
      SELECT * FROM Auditorias WHERE ID=${id}
    `;
    const result = await db.query(query);
    res.json({ auditoria: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar auditoría:", error);
    res.status(500).json({ error: "Error al actualizar auditoría" });
  }
};

exports.eliminarAuditoria = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM Auditorias WHERE ID=${id}`);
    res.json({ message: "Auditoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar auditoría:", error);
    res.status(500).json({ error: "Error al eliminar auditoría" });
  }
};
