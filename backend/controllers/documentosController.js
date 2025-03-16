const db = require("../db");
const multer = require("multer");

// Configuración de multer para generar un nombre único con timestamp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Asegúrate de que la carpeta "uploads" existe en la raíz del backend
  },
  filename: (req, file, cb) => {
    // Genera un nombre único usando Date.now() concatenado con el nombre original
    const generatedName = Date.now() + "-" + file.originalname;
    cb(null, generatedName);
  },
});
const upload = multer({ storage: storage }).single("archivo");

exports.listarDocumentos = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Documentos");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar documentos:", error);
    res.status(500).json({ error: "Error al listar documentos" });
  }
};

exports.subirDocumento = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error en multer:", err);
      return res.status(500).json({ error: "Error al subir archivo" });
    }
    try {
      // Desestructuramos file para obtener originalname y filename generado
      const { originalname, filename } = req.file;
      // La ruta se guarda con el nombre generado (con timestamp)
      const ruta = `/uploads/${filename}`;
      // Extraemos el tipo usando la extensión del original (puedes ajustarlo si lo prefieres)
      const tipo = originalname.split(".").pop();
      const query = `
        INSERT INTO Documentos (Nombre, Ruta, Tipo)
        OUTPUT INSERTED.*
        VALUES ('${originalname}', '${ruta}', '${tipo}')
      `;
      console.log("Query para subir documento:", query);
      const result = await db.query(query);
      res.json({ documento: result.recordset[0] });
    } catch (error) {
      console.error("Error al guardar documento en BD:", error);
      res.status(500).json({ error: "Error al guardar documento" });
    }
  });
};

exports.eliminarDocumento = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM Documentos WHERE ID=${id}`);
    res.json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar documento:", error);
    res.status(500).json({ error: "Error al eliminar documento" });
  }
};

// Aprobar un documento general (sin UpdatedAt)
exports.aprobarDocumento = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE Documentos
      SET estado = 'aprobado'
      WHERE ID = ${id};
      SELECT * FROM Documentos WHERE ID = ${id};
    `;
    const result = await db.query(query);
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al aprobar documento:", error);
    res.status(500).json({ error: "Error al aprobar documento." });
  }
};

// Rechazar un documento general (sin UpdatedAt)
exports.rechazarDocumento = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE Documentos
      SET estado = 'rechazado'
      WHERE ID = ${id};
      SELECT * FROM Documentos WHERE ID = ${id};
    `;
    const result = await db.query(query);
    res.json({ documento: result.recordset[0] });
  } catch (error) {
    console.error("Error al rechazar documento:", error);
    res.status(500).json({ error: "Error al rechazar documento." });
  }
};