const db = require("../db");

// Listar plantillas (opcionalmente filtradas por empresa)
exports.listarPlantillas = async (req, res) => {
  try {
    // Si deseas filtrar por empresa, asume que req.user.empresaID está disponible
    const empresaID = req.user ? req.user.empresaID : null;
    const query = empresaID 
      ? `SELECT * FROM Plantillas WHERE EmpresaID = ${empresaID}`
      : "SELECT * FROM Plantillas";
    const result = await db.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar plantillas:", error);
    res.status(500).json({ error: "Error al listar plantillas" });
  }
};

// Crear plantilla
exports.crearPlantilla = async (req, res) => {
  const { nombre, contenido, empresaID, logo } = req.body;
  try {
    const query = `
      INSERT INTO Plantillas (Nombre, Contenido, EmpresaID, Logo, CreatedAt, UpdatedAt)
      OUTPUT INSERTED.*
      VALUES ('${nombre}', '${contenido}', ${empresaID}, '${logo || ""}', GETDATE(), GETDATE())
    `;
    const result = await db.query(query);
    res.json({ plantilla: result.recordset[0] });
  } catch (error) {
    console.error("Error al crear plantilla:", error);
    res.status(500).json({ error: "Error al crear plantilla" });
  }
};

// Actualizar plantilla
exports.actualizarPlantilla = async (req, res) => {
  const { id } = req.params;
  const { nombre, contenido, logo } = req.body;
  try {
    const query = `
      UPDATE Plantillas
      SET Nombre='${nombre}', Contenido='${contenido}', Logo='${logo || ""}', UpdatedAt=GETDATE()
      WHERE ID=${id};
      SELECT * FROM Plantillas WHERE ID=${id};
    `;
    const result = await db.query(query);
    res.json({ plantilla: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar plantilla:", error);
    res.status(500).json({ error: "Error al actualizar plantilla" });
  }
};

// Eliminar plantilla
exports.eliminarPlantilla = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM Plantillas WHERE ID=${id}`);
    res.json({ message: "Plantilla eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar plantilla:", error);
    res.status(500).json({ error: "Error al eliminar plantilla" });
  }
};

// Generar PDF a partir de una plantilla (ejemplo)
exports.generarPDF = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtén la plantilla
    const result = await db.query(`SELECT * FROM Plantillas WHERE ID = ${id}`);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }
    const plantilla = result.recordset[0];

    // Aquí puedes integrar la lógica para generar un PDF (usando Puppeteer, pdfmake, etc.)
    // Por simplicidad, devolvemos la plantilla como prueba.
    // Ejemplo: res.json({ pdf: "pdf-generado-con-exito" });
    res.json({ plantilla });
  } catch (error) {
    console.error("Error al generar PDF:", error);
    res.status(500).json({ error: "Error al generar PDF" });
  }
};
