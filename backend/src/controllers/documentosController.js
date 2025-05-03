// backend/src/controllers/documentosController.js
const { poolPromise } = require('../../db');

async function listarDocumentos(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Documentos");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar documentos:", error);
    res.status(500).json({ error: "Error al listar documentos." });
  }
}

async function subirDocumento(req, res) {
  const { originalname, filename } = req.file;
  const tipo = originalname.split('.').pop();
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("nombre", filename);
    request.input("ruta", `/uploads/${filename}`);
    request.input("tipo", tipo);
    const query = `
      INSERT INTO Documentos (Nombre, Ruta, Tipo, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@nombre, @ruta, @tipo, GETDATE())
    `;
    const result = await request.query(query);
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al subir documento:", error);
    res.status(500).json({ error: "Error al subir el documento." });
  }
}

async function eliminarDocumento(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query("DELETE FROM Documentos WHERE ID = @id");
    res.json({ mensaje: "Documento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar documento:", error);
    res.status(500).json({ error: "Error al eliminar documento." });
  }
}

async function aprobarDocumento(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query(`UPDATE Documentos SET estado = 'aprobado' WHERE ID = @id`);
    const result = await request.query("SELECT * FROM Documentos WHERE ID = @id");
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al aprobar documento:", error);
    res.status(500).json({ error: "Error al aprobar documento." });
  }
}

async function rechazarDocumento(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query(`UPDATE Documentos SET estado = 'rechazado' WHERE ID = @id`);
    const result = await request.query("SELECT * FROM Documentos WHERE ID = @id");
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al rechazar documento:", error);
    res.status(500).json({ error: "Error al rechazar documento." });
  }
}

module.exports = {
  listarDocumentos,
  subirDocumento,
  eliminarDocumento,
  aprobarDocumento,
  rechazarDocumento,
};