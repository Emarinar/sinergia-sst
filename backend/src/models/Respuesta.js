// backend/src/models/Respuesta.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Respuesta', {
      formularioId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'Respuestas',
      timestamps: true
    });
  };
  