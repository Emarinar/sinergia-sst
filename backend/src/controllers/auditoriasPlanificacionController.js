// backend/src/controllers/auditoriasPlanificacionController.js
const { poolPromise } = require('../../db');

async function listarPlanificacion(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM PlanificacionAuditorias");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar planificación:", err);
    res.status(500).json({ error: "Error al listar planificación" });
  }
}

async function crearPlanificacion(req, res) {
  const { alcance, periodicidad, criterios } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("alcance", alcance);
    request.input("periodicidad", periodicidad);
    request.input("criterios", criterios);
    const query = `
      INSERT INTO PlanificacionAuditorias (Alcance, Periodicidad, Criterios, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@alcance, @periodicidad, @criterios, GETDATE())
    `;
    const result = await request.query(query);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear plan:", err);
    res.status(500).json({ error: "Error al crear planificación" });
  }
}

async function actualizarPlanificacion(req, res) {
  const { id } = req.params;
  const { alcance, periodicidad, criterios } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    request.input("alcance", alcance);
    request.input("periodicidad", periodicidad);
    request.input("criterios", criterios);
    const query = `
      UPDATE PlanificacionAuditorias
      SET Alcance = @alcance,
          Periodicidad = @periodicidad,
          Criterios = @criterios,
          UpdatedAt = GETDATE()
      WHERE ID = @id;
      SELECT * FROM PlanificacionAuditorias WHERE ID = @id;
    `;
    const result = await request.query(query);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar plan:", err);
    res.status(500).json({ error: "Error al actualizar planificación" });
  }
}

async function eliminarPlanificacion(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request().input("id", id)
      .query("DELETE FROM PlanificacionAuditorias WHERE ID = @id");
    res.json({ message: "Plan eliminado" });
  } catch (err) {
    console.error("Error al eliminar plan:", err);
    res.status(500).json({ error: "Error al eliminar planificación" });
  }
}

module.exports = {
  listarPlanificacion,
  crearPlanificacion,
  actualizarPlanificacion,
  eliminarPlanificacion,
};
