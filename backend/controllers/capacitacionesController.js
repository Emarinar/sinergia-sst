// controllers/capacitacionesController.js
const db = require("../db");

exports.listarCapacitaciones = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Capacitaciones");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar capacitaciones:", error);
    res.status(500).json({ error: "Error al listar capacitaciones" });
  }
};

exports.agregarCapacitacion = async (req, res) => {
  const { titulo, fecha, descripcion, lugar } = req.body;
  try {
    const query = `
      INSERT INTO Capacitaciones (titulo, fecha, descripcion, lugar)
      OUTPUT INSERTED.*
      VALUES ('${titulo}', '${fecha}', '${descripcion}', '${lugar}')
    `;
    const result = await db.query(query);
    res.json({ capacitacion: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar capacitación:", error);
    res.status(500).json({ error: "Error al agregar capacitación" });
  }
};

exports.actualizarCapacitacion = async (req, res) => {
  const { id } = req.params;
  const { titulo, fecha, descripcion, lugar } = req.body;
  try {
    const query = `
      UPDATE Capacitaciones
      SET titulo='${titulo}', fecha='${fecha}', descripcion='${descripcion}', lugar='${lugar}'
      WHERE id=${id};
      SELECT * FROM Capacitaciones WHERE id=${id}
    `;
    const result = await db.query(query);
    res.json({ capacitacion: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar capacitación:", error);
    res.status(500).json({ error: "Error al actualizar capacitación" });
  }
};

exports.eliminarCapacitacion = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM Capacitaciones WHERE id=${id}`);
    res.json({ message: "Capacitación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar capacitación:", error);
    res.status(500).json({ error: "Error al eliminar capacitación" });
  }
};
