// backend/src/controllers/plantillasController.js
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { poolPromise } = require("../../db");

async function listarPlantillas(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Plantillas");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar plantillas:", error);
    res.status(500).json({ error: "Error al listar plantillas." });
  }
}

async function crearPlantilla(req, res) {
  const { nombre, contenido, logo, empresaID } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("nombre", nombre);
    request.input("contenido", contenido);
    request.input("logo", logo);
    request.input("empresaID", empresaID);
    const query = `
      INSERT INTO Plantillas (Nombre, Contenido, Logo, EmpresaID, CreatedAt, UpdatedAt)
      OUTPUT INSERTED.*
      VALUES (@nombre, @contenido, @logo, @empresaID, GETDATE(), GETDATE())
    `;
    const result = await request.query(query);
    res.json({ plantilla: result.recordset[0] });
  } catch (error) {
    console.error("Error al crear plantilla:", error);
    res.status(500).json({ error: "Error al crear plantilla." });
  }
}

async function actualizarPlantilla(req, res) {
  const { id } = req.params;
  const { nombre, contenido, logo, empresaID } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    request.input("nombre", nombre);
    request.input("contenido", contenido);
    request.input("logo", logo);
    request.input("empresaID", empresaID);
    const query = `
      UPDATE Plantillas
      SET Nombre = @nombre,
          Contenido = @contenido,
          Logo = @logo,
          EmpresaID = @empresaID,
          UpdatedAt = GETDATE()
      WHERE ID = @id;
      SELECT * FROM Plantillas WHERE ID = @id;
    `;
    const result = await request.query(query);
    res.json({ plantilla: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar plantilla:", error);
    res.status(500).json({ error: "Error al actualizar plantilla." });
  }
}

async function eliminarPlantilla(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query("DELETE FROM Plantillas WHERE ID = @id");
    res.json({ mensaje: "Plantilla eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar plantilla:", error);
    res.status(500).json({ error: "Error al eliminar plantilla." });
  }
}

async function generarPDF(req, res) {
  const { id } = req.params;
  try {
    // 1) Leer la plantilla desde BD
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    const result = await request.query("SELECT Contenido, Nombre FROM Plantillas WHERE ID = @id");
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }
    const { Contenido, Nombre } = result.recordset[0];

    // 2) Leer CSS global
    const cssPath = path.join(__dirname, "..", "..", "public", "template.css");
    const css = fs.readFileSync(cssPath, "utf8");

    // 3) Construir HTML completo
    const html = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8"/>
          <title>${Nombre}</title>
          <style>${css}</style>
        </head>
        <body>${Contenido}</body>
      </html>
    `;

    // 4) Generar PDF con Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // 5) Enviar al cliente
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=plantilla_${id}.pdf`,
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    res.status(500).json({ error: "Error al generar PDF." });
  }
}

module.exports = {
  listarPlantillas,
  crearPlantilla,
  actualizarPlantilla,
  eliminarPlantilla,
  generarPDF,
};
