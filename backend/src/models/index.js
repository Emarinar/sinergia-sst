// backend/src/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    dialectOptions: {
      options: { encrypt: true }
    },
    logging: false
  }
);

const Formulario = require('./Formulario')(sequelize, DataTypes);
const Campo = require('./Campo')(sequelize, DataTypes);
const Respuesta = require('./Respuesta')(sequelize, DataTypes);
const RespuestaCampo = require('./RespuestaCampo')(sequelize, DataTypes);

// Relaciones
Formulario.hasMany(Campo, { as: 'campos', foreignKey: 'formularioId', onDelete: 'CASCADE' });
Campo.belongsTo(Formulario, { foreignKey: 'formularioId' });

Respuesta.hasMany(RespuestaCampo, { as: 'campos', foreignKey: 'respuestaId', onDelete: 'CASCADE' });
RespuestaCampo.belongsTo(Respuesta, { foreignKey: 'respuestaId' });

Campo.hasMany(RespuestaCampo, { foreignKey: 'campoId', onDelete: 'CASCADE' });
RespuestaCampo.belongsTo(Campo, { foreignKey: 'campoId' });

module.exports = {
  sequelize,
  Formulario,
  Campo,
  Respuesta,
  RespuestaCampo
};
