const { poolPromise } = require('../../db');  // Ajusta la ruta si tu db.js está en otra ubicación

// Obtener todos los documentos de un empleado
async function obtenerDocumentosEmpleado(req, res) {
  const { employeeId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('employeeId', employeeId)
      .query('SELECT * FROM EmpleadosDocumentos WHERE EmployeeID = @employeeId');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener documentos del empleado:', error);
    res.status(500).json({ error: 'Error al obtener documentos del empleado.' });
  }
}

// Subir un nuevo documento para un empleado
async function subirDocumentoEmpleado(req, res) {
  const { employeeId } = req.body;
  const { originalname, filename } = req.file; // multer
  const tipo = originalname.split('.').pop();
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('nombre', filename)
      .input('ruta', `/uploads/${filename}`)
      .input('tipo', tipo)
      .input('employeeId', employeeId)
      .query(`
        INSERT INTO EmpleadosDocumentos (Nombre, Ruta, Tipo, EmployeeID, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@nombre, @ruta, @tipo, @employeeId, GETDATE())
      `);
    res.status(201).json({ documento: result.recordset[0] });
  } catch (error) {
    console.error('Error al subir documento del empleado:', error);
    res.status(500).json({ error: 'Error al subir documento del empleado.' });
  }
}

// Aprobar un documento previamente subido
async function aprobarDocumentoEmpleado(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('id', id)
      .query(`
        UPDATE EmpleadosDocumentos
        SET estado = 'aprobado'
        WHERE ID = @id
      `);
    const result = await pool
      .request()
      .input('id', id)
      .query('SELECT * FROM EmpleadosDocumentos WHERE ID = @id');
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error('Error al aprobar documento del empleado:', error);
    res.status(500).json({ error: 'Error al aprobar documento del empleado.' });
  }
}

// Rechazar un documento previamente subido
async function rechazarDocumentoEmpleado(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('id', id)
      .query(`
        UPDATE EmpleadosDocumentos
        SET estado = 'rechazado'
        WHERE ID = @id
      `);
    const result = await pool
      .request()
      .input('id', id)
      .query('SELECT * FROM EmpleadosDocumentos WHERE ID = @id');
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error('Error al rechazar documento del empleado:', error);
    res.status(500).json({ error: 'Error al rechazar documento del empleado.' });
  }
}

module.exports = {
  obtenerDocumentosEmpleado,
  subirDocumentoEmpleado,
  aprobarDocumentoEmpleado,
  rechazarDocumentoEmpleado,
};
