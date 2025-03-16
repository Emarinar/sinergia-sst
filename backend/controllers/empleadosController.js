// backend/controllers/empleadosController.js
const db = require("../db");

exports.listarEmpleados = async (req, res) => {
  try {
    const empresaID = req.user.empresaID;
    if (!empresaID) {
      return res.status(400).json({ error: "El token no contiene EmpresaID." });
    }
    const result = await db.query(`SELECT * FROM Empleados WHERE EmpresaID = ${empresaID}`);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar empleados:", error);
    res.status(500).json({ error: "Error al listar empleados" });
  }
};

exports.agregarEmpleado = async (req, res) => {
  const { nombre, cargo, empresa } = req.body; // 'empresa' es el ID de la empresa
  try {
    const query = `
      INSERT INTO Empleados (Nombre, Cargo, EmpresaID)
      OUTPUT INSERTED.*
      VALUES ('${nombre}', '${cargo}', ${empresa})
    `;
    const result = await db.query(query);
    res.json({ empleado: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar empleado:", error);
    res.status(500).json({ error: "Error al agregar empleado" });
  }
};

exports.actualizarEmpleado = async (req, res) => {
  const { id } = req.params;
  const { nombre, cargo, empresa } = req.body;
  try {
    const query = `
      UPDATE Empleados 
      SET Nombre='${nombre}', Cargo='${cargo}', EmpresaID=${empresa}, UpdatedAt=GETDATE()
      WHERE ID=${id};
      SELECT * FROM Empleados WHERE ID=${id};
    `;
    const result = await db.query(query);
    res.json({ empleado: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: "Error al actualizar empleado" });
  }
};

exports.eliminarEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM Empleados WHERE ID=${id}`);
    res.json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ error: "Error al eliminar empleado" });
  }
};
