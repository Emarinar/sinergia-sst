// backend/src/controllers/accionesController.js
const { poolPromise } = require('../../db');

async function listarAcciones(req, res) {
  const { auditoriaId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("auditoriaId", auditoriaId)
      .query("SELECT * FROM AccionesCorrectivas WHERE AuditoriaID = @auditoriaId");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar acciones:", err);
    res.status(500).json({ error: "Error al listar acciones" });
  }
}

async function crearAccion(req, res) {
  const { auditoriaId } = req.params;
  const { descripcion, responsable, fechaVencimiento, prioridad } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("auditoriaId", auditoriaId);
    request.input("descripcion", descripcion);
    request.input("responsable", responsable);
    request.input("fechaVencimiento", fechaVencimiento);
    request.input("prioridad", prioridad);
    const query = `
      INSERT INTO AccionesCorrectivas 
        (AuditoriaID, Descripcion, Responsable, FechaVencimiento, Prioridad, Estado, CreatedAt)
      OUTPUT INSERTED.*
      VALUES 
        (@auditoriaId, @descripcion, @responsable, @fechaVencimiento, @prioridad, 'Pendiente', GETDATE())
    `;
    const result = await request.query(query);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear acción:", err);
    res.status(500).json({ error: "Error al crear acción" });
  }
}

async function actualizarAccion(req, res) {
  const { id } = req.params;
  const { descripcion, responsable, fechaVencimiento, prioridad, estado } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    request.input("descripcion", descripcion);
    request.input("responsable", responsable);
    request.input("fechaVencimiento", fechaVencimiento);
    request.input("prioridad", prioridad);
    request.input("estado", estado);
    const query = `
      UPDATE AccionesCorrectivas
      SET Descripcion = @descripcion,
          Responsable = @responsable,
          FechaVencimiento = @fechaVencimiento,
          Prioridad = @prioridad,
          Estado = @estado,
          UpdatedAt = GETDATE()
      WHERE ID = @id;
      SELECT * FROM AccionesCorrectivas WHERE ID = @id;
    `;
    const result = await request.query(query);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar acción:", err);
    res.status(500).json({ error: "Error al actualizar acción" });
  }
}

async function eliminarAccion(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request().input("id", id)
      .query("DELETE FROM AccionesCorrectivas WHERE ID = @id");
    res.json({ message: "Acción eliminada" });
  } catch (err) {
    console.error("Error al eliminar acción:", err);
    res.status(500).json({ error: "Error al eliminar acción" });
  }
}

module.exports = {
  listarAcciones,
  crearAccion,
  actualizarAccion,
  eliminarAccion,
};
