// backend/controllers/auditoriasController.js
const { poolPromise } = require("../db");

async function listarAuditorias(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Auditorias");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar auditorías:", error);
    res.status(500).json({ error: "Error al listar auditorías." });
  }
}

async function agregarAuditoria(req, res) {
  const { nombre, fecha, responsable, estado, detalles } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("nombre", nombre);
    request.input("fecha", fecha);
    request.input("responsable", responsable);
    request.input("estado", estado);
    request.input("detalles", detalles);
    const query = `
      INSERT INTO Auditorias (Nombre, Fecha, Responsable, Estado, Detalles, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@nombre, @fecha, @responsable, @estado, @detalles, GETDATE())
    `;
    const result = await request.query(query);
    res.json({ auditoria: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar auditoría:", error);
    res.status(500).json({ error: "Error al agregar auditoría." });
  }
}

async function actualizarAuditoria(req, res) {
  const { id } = req.params;
  const { nombre, fecha, responsable, estado, detalles } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    request.input("nombre", nombre);
    request.input("fecha", fecha);
    request.input("responsable", responsable);
    request.input("estado", estado);
    request.input("detalles", detalles);
    const query = `
      UPDATE Auditorias
      SET Nombre = @nombre,
          Fecha = @fecha,
          Responsable = @responsable,
          Estado = @estado,
          Detalles = @detalles,
          UpdatedAt = GETDATE()
      WHERE ID = @id;
      SELECT * FROM Auditorias WHERE ID = @id;
    `;
    const result = await request.query(query);
    res.json({ auditoria: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar auditoría:", error);
    res.status(500).json({ error: "Error al actualizar auditoría." });
  }
}

async function eliminarAuditoria(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query("DELETE FROM Auditorias WHERE ID = @id");
    res.json({ message: "Auditoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar auditoría:", error);
    res.status(500).json({ error: "Error al eliminar auditoría." });
  }
}

module.exports = {
  listarAuditorias,
  agregarAuditoria,
  actualizarAuditoria,
  eliminarAuditoria,
};
