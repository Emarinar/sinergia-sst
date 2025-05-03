// backend/src/models/RespuestaCampo.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('RespuestaCampo', {
      respuestaId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      campoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      valor: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'RespuestaCampos',
      timestamps: false
    });
  };
  