// backend/controllers/empleadosDocumentosController.js
const db = require("../db");
const multer = require("multer");
const path = require("path");

// Configurar multer para guardar archivos en "uploads/empleados/"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/empleados/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Endpoint para subir documento de empleado
exports.subirDocumentoEmpleado = (req, res) => {
  upload.single("archivo")(req, res, async (err) => {
    if (err) {
      console.error("Error en multer:", err);
      return res.status(500).json({ error: "Error al subir el archivo." });
    }
    try {
      const { employeeId } = req.body;
      if (!employeeId) {
        return res.status(400).json({ error: "Falta el employeeId en el formulario." });
      }
      // Asegurarse que employeeId sea numérico
      const empId = parseInt(employeeId, 10);
      if (isNaN(empId)) {
        return res.status(400).json({ error: "El employeeId debe ser numérico." });
      }
      const { originalname, filename } = req.file;
      const ruta = `/uploads/empleados/${filename}`;
      const tipo = path.extname(originalname).substring(1); // sin el punto
      console.log("Subiendo documento:", { originalname, ruta, tipo, empId });
      const query = `
        INSERT INTO EmpleadosDocumentos (Nombre, Ruta, Tipo, EmployeeID)
        OUTPUT INSERTED.*
        VALUES ('${originalname}', '${ruta}', '${tipo}', ${empId})
      `;
      const result = await db.query(query);
      res.json({ documento: result.recordset[0] });
    } catch (error) {
      console.error("Error al guardar documento de empleado:", error);
      res.status(500).json({ error: "Error al guardar documento de empleado." });
    }
  });
};

// Endpoint para obtener documentos de un empleado
exports.obtenerDocumentosEmpleado = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const query = `SELECT * FROM EmpleadosDocumentos WHERE EmployeeID = ${employeeId}`;
    const result = await db.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener documentos del empleado:", error);
    res.status(500).json({ error: "Error al obtener documentos del empleado." });
  }
};

// Aprobar documento de empleado
exports.aprobarDocumentoEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE EmpleadosDocumentos
      SET estado = 'aprobado', UpdatedAt = GETDATE()
      WHERE ID = ${id};
      SELECT * FROM EmpleadosDocumentos WHERE ID = ${id};
    `;
    const result = await db.query(query);
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al aprobar documento del empleado:", error);
    res.status(500).json({ error: "Error al aprobar documento del empleado." });
  }
};

// Rechazar documento de empleado
exports.rechazarDocumentoEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE EmpleadosDocumentos
      SET estado = 'rechazado', UpdatedAt = GETDATE()
      WHERE ID = ${id};
      SELECT * FROM EmpleadosDocumentos WHERE ID = ${id};
    `;
    const result = await db.query(query);
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al rechazar documento del empleado:", error);
    res.status(500).json({ error: "Error al rechazar documento del empleado." });
  }
};