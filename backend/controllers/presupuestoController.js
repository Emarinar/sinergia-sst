// backend/controllers/presupuestoController.js
const { poolPromise } = require("../db");

async function listarGastos(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Presupuestos");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar gastos:", error);
    res.status(500).json({ error: "Error al listar gastos" });
  }
}

async function agregarGasto(req, res) {
  const { fecha, categoria, descripcion, monto, factura, proveedor, empresaID } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("fecha", fecha);
    request.input("categoria", categoria);
    request.input("descripcion", descripcion);
    request.input("monto", monto);
    request.input("factura", factura);
    request.input("proveedor", proveedor);
    request.input("empresaID", empresaID);
    const query = `
      INSERT INTO Presupuestos (Fecha, Categoria, Descripcion, Monto, Factura, Proveedor, EmpresaID, CreatedAt, UpdatedAt)
      OUTPUT INSERTED.*
      VALUES (@fecha, @categoria, @descripcion, @monto, @factura, @proveedor, @empresaID, GETDATE(), GETDATE())
    `;
    const result = await request.query(query);
    res.json({ gasto: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar gasto:", error);
    res.status(500).json({ error: "Error al agregar gasto" });
  }
}

module.exports = {
  listarGastos,
  agregarGasto,
};
