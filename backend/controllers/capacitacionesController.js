// backend/controllers/capacitacionesController.js
const { poolPromise } = require("../db");

async function listarCapacitaciones(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Capacitaciones");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar capacitaciones:", error);
    res.status(500).json({ error: "Error al listar capacitaciones." });
  }
}

async function agregarCapacitacion(req, res) {
  const { nombre, fecha, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("nombre", nombre);
    request.input("fecha", fecha);
    request.input("descripcion", descripcion);
    const query = `
      INSERT INTO Capacitaciones (Nombre, Fecha, Descripcion, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@nombre, @fecha, @descripcion, GETDATE())
    `;
    const result = await request.query(query);
    res.json({ capacitacion: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar capacitación:", error);
    res.status(500).json({ error: "Error al agregar capacitación." });
  }
}

async function actualizarCapacitacion(req, res) {
  const { id } = req.params;
  const { nombre, fecha, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    request.input("nombre", nombre);
    request.input("fecha", fecha);
    request.input("descripcion", descripcion);
    const query = `
      UPDATE Capacitaciones
      SET Nombre = @nombre,
          Fecha = @fecha,
          Descripcion = @descripcion,
          UpdatedAt = GETDATE()
      WHERE ID = @id;
      SELECT * FROM Capacitaciones WHERE ID = @id;
    `;
    const result = await request.query(query);
    res.json({ capacitacion: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar capacitación:", error);
    res.status(500).json({ error: "Error al actualizar capacitación." });
  }
}

async function eliminarCapacitacion(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query("DELETE FROM Capacitaciones WHERE ID = @id");
    res.json({ message: "Capacitación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar capacitación:", error);
    res.status(500).json({ error: "Error al eliminar capacitación." });
  }
}

module.exports = {
  listarCapacitaciones,
  agregarCapacitacion,
  actualizarCapacitacion,
  eliminarCapacitacion,
};
