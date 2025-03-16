// backend/controllers/documentosController.js
const { poolPromise } = require("../db");

exports.listarDocumentos = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Documentos");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar documentos:", error);
    res.status(500).json({ error: "Error al listar documentos." });
  }
};

exports.subirDocumento = async (req, res) => {
  // Suponiendo que usas multer y recibes req.file
  const { originalname, filename } = req.file;
  const tipo = originalname.split('.').pop();
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("nombre", filename);
    request.input("ruta", `/uploads/${filename}`);
    request.input("tipo", tipo);
    // Aquí se asume que la tabla Documentos tiene las columnas Nombre, Ruta, Tipo, etc.
    const result = await request.query(`
      INSERT INTO Documentos (Nombre, Ruta, Tipo, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@nombre, @ruta, @tipo, GETDATE())
    `);
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al subir documento:", error);
    res.status(500).json({ error: "Error al subir el documento." });
  }
};

exports.eliminarDocumento = async (req, res) => {
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
};

exports.aprobarDocumento = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query(`
      UPDATE Documentos
      SET estado = 'aprobado'
      WHERE ID = @id;
    `);
    const result = await request.query("SELECT * FROM Documentos WHERE ID = @id");
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al aprobar documento:", error);
    res.status(500).json({ error: "Error al aprobar documento." });
  }
};

exports.rechazarDocumento = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query(`
      UPDATE Documentos
      SET estado = 'rechazado'
      WHERE ID = @id;
    `);
    const result = await request.query("SELECT * FROM Documentos WHERE ID = @id");
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al rechazar documento:", error);
    res.status(500).json({ error: "Error al rechazar documento." });
  }
};
