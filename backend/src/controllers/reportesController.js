// backend/src/controllers/reportesController.js
const { poolPromise } = require('../../db');

async function reporteEmpresas(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Empresas');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error en reporte de empresas:', error);
    res.status(500).json({ error: 'Error en reporte de empresas.' });
  }
}

async function reporteEmpleados(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Empleados');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error en reporte de empleados:', error);
    res.status(500).json({ error: 'Error en reporte de empleados.' });
  }
}

async function reporteDocumentos(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Documentos');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error en reporte de documentos:', error);
    res.status(500).json({ error: 'Error en reporte de documentos.' });
  }
}

module.exports = {
  reporteEmpresas,
  reporteEmpleados,
  reporteDocumentos,
};
