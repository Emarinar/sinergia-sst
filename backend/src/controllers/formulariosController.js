const { poolPromise } = require('../../db');
const sql = require('mssql');

async function getAll(req, res) {
  try {
    const pool = await poolPromise;
    const formsResult = await pool.request().query(`
      SELECT ID, Titulo, Descripcion
      FROM Formularios
      ORDER BY ID
    `);
    const forms = await Promise.all(
      formsResult.recordset.map(async f => {
        const camposRes = await pool.request()
          .input('formId', sql.Int, f.ID)
          .query(`
            SELECT ID, Etiqueta, Tipo, Opciones, Requerido
            FROM Campos
            WHERE FormularioId = @formId
            ORDER BY ID
          `);
        return { ...f, campos: camposRes.recordset };
      })
    );
    res.json(forms);
  } catch (err) {
    console.error('Error al listar formularios:', err);
    res.status(500).json({ error: err.message });
  }
}

async function getOne(req, res) {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const formRes = await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .query(`
        SELECT ID, Titulo, Descripcion
        FROM Formularios
        WHERE ID = @id
      `);
    if (!formRes.recordset.length) {
      return res.status(404).json({ error: 'Formulario no encontrado.' });
    }
    const form = formRes.recordset[0];
    const camposRes = await pool.request()
      .input('formId', sql.Int, form.ID)
      .query(`
        SELECT ID, Etiqueta, Tipo, Opciones, Requerido
        FROM Campos
        WHERE FormularioId = @formId
        ORDER BY ID
      `);
    res.json({ ...form, campos: camposRes.recordset });
  } catch (err) {
    console.error('Error al obtener formulario:', err);
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const { titulo, descripcion, campos } = req.body;
    const pool = await poolPromise;
    const insertForm = await pool.request()
      .input('titulo', sql.NVarChar, titulo)
      .input('descripcion', sql.NVarChar, descripcion || '')
      .query(`
        INSERT INTO Formularios (Titulo, Descripcion, CreatedAt, UpdatedAt)
        OUTPUT INSERTED.ID
        VALUES (@titulo, @descripcion, GETDATE(), GETDATE())
      `);
    const formId = insertForm.recordset[0].ID;
    for (const c of campos || []) {
      await pool.request()
        .input('formId', sql.Int, formId)
        .input('etiqueta', sql.NVarChar, c.etiqueta)
        .input('tipo', sql.NVarChar, c.tipo)
        .input('opciones', sql.NVarChar, JSON.stringify(c.opciones || []))
        .input('requerido', sql.Bit, c.requerido ? 1 : 0)
        .query(`
          INSERT INTO Campos (FormularioId, Etiqueta, Tipo, Opciones, Requerido)
          VALUES (@formId, @etiqueta, @tipo, @opciones, @requerido)
        `);
    }
    res.status(201).json({ id: formId });
  } catch (err) {
    console.error('Error al crear formulario:', err);
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descripcion, campos } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .input('titulo', sql.NVarChar, titulo)
      .input('descripcion', sql.NVarChar, descripcion || '')
      .query(`
        UPDATE Formularios
        SET Titulo = @titulo, Descripcion = @descripcion, UpdatedAt = GETDATE()
        WHERE ID = @id
      `);
    await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .query(`DELETE FROM Campos WHERE FormularioId = @id`);
    for (const c of campos || []) {
      await pool.request()
        .input('formId', sql.Int, parseInt(id, 10))
        .input('etiqueta', sql.NVarChar, c.etiqueta)
        .input('tipo', sql.NVarChar, c.tipo)
        .input('opciones', sql.NVarChar, JSON.stringify(c.opciones || []))
        .input('requerido', sql.Bit, c.requerido ? 1 : 0)
        .query(`
          INSERT INTO Campos (FormularioId, Etiqueta, Tipo, Opciones, Requerido)
          VALUES (@formId, @etiqueta, @tipo, @opciones, @requerido)
        `);
    }
    res.json({ message: 'Formulario actualizado' });
  } catch (err) {
    console.error('Error al actualizar formulario:', err);
    res.status(500).json({ error: err.message });
  }
}

async function del(req, res) {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .query(`DELETE FROM Campos WHERE FormularioId = @id`);
    await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .query(`DELETE FROM Formularios WHERE ID = @id`);
    res.status(204).end();
  } catch (err) {
    console.error('Error al eliminar formulario:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getOne, create, update, delete: del };
