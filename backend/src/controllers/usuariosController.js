// backend/src/controllers/usuariosController.js
require('dotenv').config();
const { poolPromise } = require('../../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function listarUsuarios(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Usuarios');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ mensaje: 'Error al listar usuarios.' });
  }
}

async function registrarUsuario(req, res) {
  const { nombre, correo, clave, rol, empresaID } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    // Encriptar la clave
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(clave, salt);

    request.input('nombre', nombre);
    request.input('correo', correo);
    request.input('clave', hashed);
    request.input('rol', rol);
    request.input('empresaID', empresaID);

    const query = `
      INSERT INTO Usuarios (Nombre, Correo, Clave, Rol, EmpresaID, CreatedAt, UpdatedAt)
      OUTPUT INSERTED.*
      VALUES (@nombre, @correo, @clave, @rol, @empresaID, GETDATE(), GETDATE())
    `;
    const result = await request.query(query);
    res.json({ usuario: result.recordset[0] });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario.' });
  }
}

async function login(req, res) {
  const { correo, clave } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('correo', correo)
      .query('SELECT * FROM Usuarios WHERE Correo = @correo');

    if (!result.recordset.length) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const user = result.recordset[0];
    if (!bcrypt.compareSync(clave, user.Clave)) {
      return res.status(401).json({ mensaje: 'Clave incorrecta.' });
    }

    const token = jwt.sign(
      { id: user.ID, rol: user.Rol, empresaID: user.EmpresaID },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el inicio de sesión.' });
  }
}

async function actualizarUsuario(req, res) {
  const { id } = req.params;
  const { nombre, correo, rol, empresaID } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('id', id);
    request.input('nombre', nombre);
    request.input('correo', correo);
    request.input('rol', rol);
    request.input('empresaID', empresaID);

    const query = `
      UPDATE Usuarios
      SET Nombre = @nombre,
          Correo = @correo,
          Rol = @rol,
          EmpresaID = @empresaID,
          UpdatedAt = GETDATE()
      WHERE ID = @id;
      SELECT * FROM Usuarios WHERE ID = @id;
    `;
    const result = await request.query(query);
    res.json({ usuario: result.recordset[0] });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario.' });
  }
}

async function eliminarUsuario(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('id', id);
    await request.query('DELETE FROM Usuarios WHERE ID = @id');
    res.json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario.' });
  }
}

module.exports = {
  listarUsuarios,
  registrarUsuario,
  login,
  actualizarUsuario,
  eliminarUsuario,
};
