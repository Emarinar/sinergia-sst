// backend/controllers/empleadosDocumentosController.js
const { poolPromise } = require("../db");

async function obtenerDocumentosEmpleado(req, res) {
  const { employeeId } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("employeeId", employeeId);
    const result = await request.query("SELECT * FROM EmpleadosDocumentos WHERE EmployeeID = @employeeId");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener documentos del empleado:", error);
    res.status(500).json({ error: "Error al obtener documentos del empleado." });
  }
}

async function subirDocumentoEmpleado(req, res) {
  // Se asume que se usa multer para manejar archivos y que employeeId viene en req.body
  const { employeeId } = req.body;
  const { originalname, filename } = req.file;
  const tipo = originalname.split('.').pop();
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("nombre", filename);
    request.input("ruta", `/uploads/${filename}`);
    request.input("tipo", tipo);
    request.input("employeeId", employeeId);
    const query = `
      INSERT INTO EmpleadosDocumentos (Nombre, Ruta, Tipo, EmployeeID, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@nombre, @ruta, @tipo, @employeeId, GETDATE())
    `;
    const result = await request.query(query);
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al subir documento del empleado:", error);
    res.status(500).json({ error: "Error al subir documento del empleado." });
  }
}

async function aprobarDocumentoEmpleado(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query(`
      UPDATE EmpleadosDocumentos
      SET estado = 'aprobado'
      WHERE ID = @id;
    `);
    const result = await request.query("SELECT * FROM EmpleadosDocumentos WHERE ID = @id");
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al aprobar documento del empleado:", error);
    res.status(500).json({ error: "Error al aprobar documento del empleado." });
  }
}

async function rechazarDocumentoEmpleado(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query(`
      UPDATE EmpleadosDocumentos
      SET estado = 'rechazado'
      WHERE ID = @id;
    `);
    const result = await request.query("SELECT * FROM EmpleadosDocumentos WHERE ID = @id");
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al rechazar documento del empleado:", error);
    res.status(500).json({ error: "Error al rechazar documento del empleado." });
  }
}

module.exports = {
  obtenerDocumentosEmpleado,
  subirDocumentoEmpleado,
  aprobarDocumentoEmpleado,
  rechazarDocumentoEmpleado,
};
