// backend/controllers/usuariosController.js
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { correo, clave } = req.body;
  try {
    const result = await db.query(`SELECT * FROM Usuarios WHERE Correo='${correo}'`);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const usuario = result.recordset[0];
    const valid = bcrypt.compareSync(clave, usuario.Clave);
    if (!valid) {
      return res.status(401).json({ error: "Clave incorrecta" });
    }
    // Verificar que EmpresaID tenga un valor válido
    if (usuario.EmpresaID === null || usuario.EmpresaID === undefined) {
      return res.status(400).json({ error: "El usuario no tiene asignado una empresa." });
    }
    // Incluir EmpresaID en el token
    const token = jwt.sign(
      { id: usuario.ID, rol: usuario.Rol, empresaID: usuario.EmpresaID },
      "tu_clave_secreta",
      { expiresIn: 86400 }
    );
    res.json({ token, usuario });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en login" });
  }
};

exports.register = async (req, res) => {
  const { nombre, correo, clave, rol, empresaID } = req.body;
  try {
    const hashedClave = bcrypt.hashSync(clave, 8);
    const query = `
      INSERT INTO Usuarios (Nombre, Correo, Clave, Rol, EmpresaID, CreatedAt, UpdatedAt)
      OUTPUT INSERTED.*
      VALUES ('${nombre}', '${correo}', '${hashedClave}', '${rol}', ${empresaID}, GETDATE(), GETDATE())
    `;
    console.log("Query de registro:", query);
    const result = await db.query(query);
    res.json({ usuario: result.recordset[0] });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const empresaID = req.user.empresaID;
    if (!empresaID) {
      return res.status(400).json({ error: "El token no contiene EmpresaID." });
    }
    const result = await db.query(`SELECT * FROM Usuarios WHERE EmpresaID = ${empresaID}`);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol, empresaID, clave } = req.body;
  try {
    let query = "";
    if (clave && clave.trim() !== "") {
      const hashedClave = bcrypt.hashSync(clave, 8);
      query = `
        UPDATE Usuarios 
        SET Nombre='${nombre}', Correo='${correo}', Rol='${rol}', EmpresaID=${empresaID}, Clave='${hashedClave}', UpdatedAt=GETDATE()
        WHERE ID=${id};
        SELECT * FROM Usuarios WHERE ID=${id};
      `;
    } else {
      query = `
        UPDATE Usuarios 
        SET Nombre='${nombre}', Correo='${correo}', Rol='${rol}', EmpresaID=${empresaID}, UpdatedAt=GETDATE()
        WHERE ID=${id};
        SELECT * FROM Usuarios WHERE ID=${id};
      `;
    }
    const result = await db.query(query);
    res.json({ usuario: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM Usuarios WHERE ID=${id}`);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
