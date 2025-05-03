// backend/src/controllers/respuestasController.js

const { Respuesta, RespuestaCampo, Campo } = require('../models');
const ExcelJS = require('exceljs');

// Envia una nueva respuesta
exports.submit = async (req, res, next) => {
  try {
    const { id: formularioId } = req.params;
    const { campos } = req.body; // [{ campoId, valor }]
    const respuesta = await Respuesta.create({ formularioId });
    await RespuestaCampo.bulkCreate(
      campos.map(c => ({ ...c, respuestaId: respuesta.id }))
    );
    res.status(201).json(respuesta);
  } catch (err) {
    console.error('Error al guardar respuesta:', err);
    res.status(500).json({ error: 'Error al guardar respuesta' });
  }
};

// Lista todas las respuestas de un formulario
exports.list = async (req, res, next) => {
  try {
    const { id: formularioId } = req.params;
    const respuestas = await Respuesta.findAll({
      where: { formularioId },
      include: [{ model: RespuestaCampo, as: 'campos', include: [Campo] }]
    });
    res.json(respuestas);
  } catch (err) {
    console.error('Error al listar respuestas:', err);
    res.status(500).json({ error: 'Error al listar respuestas' });
  }
};

// Exporta las respuestas a Excel para un formulario
exports.export = async (req, res, next) => {
  try {
    const { id: formularioId } = req.params;
    const respuestas = await Respuesta.findAll({
      where: { formularioId },
      include: [{ model: RespuestaCampo, as: 'campos', include: [Campo] }]
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Respuestas');

    // Cabecera
    const header = respuestas[0]?.campos.map(rc => rc.Campo.etiqueta) || [];
    sheet.addRow(header);

    // Filas de datos
    respuestas.forEach(r => {
      const row = r.campos.map(rc => rc.valor);
      sheet.addRow(row);
    });

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=respuestas_${formularioId}.xlsx`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error al exportar respuestas:', err);
    res.status(500).json({ error: 'Error al exportar respuestas' });
  }
};
