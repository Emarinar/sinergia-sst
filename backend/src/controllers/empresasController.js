// backend/src/controllers/empresasController.js
const { poolPromise } = require('../../db');

async function listarEmpresas(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Empresas");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar empresas:", error);
    res.status(500).json({ error: "Error al listar empresas" });
  }
}

async function agregarEmpresa(req, res) {  // tu función original
  const { nombre, nit, contacto } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("nombre", nombre);
    request.input("nit", nit);
    request.input("contacto", contacto);
    const result = await request.query(`
      INSERT INTO Empresas (Nombre, Nit, Contacto)
      OUTPUT INSERTED.*
      VALUES (@nombre, @nit, @contacto)
    `);
    res.json({ empresa: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar empresa:", error);
    res.status(500).json({ error: "Error al agregar empresa" });
  }
}

async function actualizarEmpresa(req, res) {
  const { id } = req.params;
  const { nombre, nit, contacto } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id).input("nombre", nombre).input("nit", nit).input("contacto", contacto);
    const result = await request.query(`
      UPDATE Empresas
      SET Nombre=@nombre, Nit=@nit, Contacto=@contacto
      WHERE ID=@id;
      SELECT * FROM Empresas WHERE ID=@id;
    `);
    res.json({ empresa: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    res.status(500).json({ error: "Error al actualizar empresa" });
  }
}

async function eliminarEmpresa(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request().input("id", id).query("DELETE FROM Empresas WHERE ID=@id");
    res.json({ message: "Empresa eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar empresa:", error);
    res.status(500).json({ error: "Error al eliminar empresa" });
  }
}

module.exports = {
  listarEmpresas,
  registrarEmpresa: agregarEmpresa,  // alias para que tu ruta POST '/:/' llame a agregarEmpresa
  actualizarEmpresa,
  eliminarEmpresa
};
