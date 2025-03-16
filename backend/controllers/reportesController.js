// backend/controllers/reportesController.js
const db = require("../db");

exports.reporteEmpresas = async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) AS TotalEmpresas FROM Empresas");
    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error en reporte de empresas:", error);
    res.status(500).json({ error: "Error en reporte de empresas" });
  }
};

exports.reporteEmpleados = async (req, res) => {
  try {
    const empresaID = req.user.empresaID;
    if (!empresaID) {
      return res.status(400).json({ error: "El token no contiene EmpresaID." });
    }
    const result = await db.query(`SELECT COUNT(*) AS TotalEmpleados FROM Empleados WHERE EmpresaID = ${empresaID}`);
    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error en reporte de empleados:", error);
    res.status(500).json({ error: "Error en reporte de empleados" });
  }
};

exports.reporteDocumentos = async (req, res) => {
  try {
    const empresaID = req.user.empresaID;
    if (!empresaID) {
      return res.status(400).json({ error: "El token no contiene EmpresaID." });
    }
    const result = await db.query(`SELECT COUNT(*) AS TotalDocumentos FROM Documentos WHERE EmpresaID = ${empresaID}`);
    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error en reporte de documentos:", error);
    res.status(500).json({ error: "Error en reporte de documentos" });
  }
};

