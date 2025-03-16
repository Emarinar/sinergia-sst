const db = require("../db");

async function listarEmpresas(req, res) {
  try {
    const result = await db.query("SELECT * FROM Empresas");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar empresas:", error);
    res.status(500).json({ error: "Error al listar empresas" });
  }
}

async function agregarEmpresa(req, res) {
  const { nombre, nit, contacto } = req.body;
  try {
    const query = `
      INSERT INTO Empresas (nombre, nit, contacto)
      OUTPUT INSERTED.*
      VALUES ('${nombre}', '${nit}', '${contacto}')
    `;
    const result = await db.query(query);
    res.json({ empresa: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar empresa:", error);
    res.status(500).json({ error: "Error al agregar empresa" });
  }
}

async function actualizarEmpresa(req, res) {
  const { id } = req.params;
  const { nombre, nit, contacto } = req.body;
  try {
    const query = `
      UPDATE Empresas 
      SET nombre='${nombre}', nit='${nit}', contacto='${contacto}'
      WHERE ID=${id};
      SELECT * FROM Empresas WHERE ID=${id}
    `;
    const result = await db.query(query);
    res.json({ empresa: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    res.status(500).json({ error: "Error al actualizar empresa" });
  }
}

async function eliminarEmpresa(req, res) {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM Empresas WHERE ID=${id}`);
    res.json({ message: "Empresa eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar empresa:", error);
    res.status(500).json({ error: "Error al eliminar empresa" });
  }
}

module.exports = {
  listarEmpresas,
  agregarEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
};
