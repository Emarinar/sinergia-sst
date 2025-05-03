// backend/src/models/Campo.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Campo', {
      etiqueta: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      opciones: {
        type: DataTypes.TEXT, // JSON.stringify de opciones (para select, checkbox, etc.)
        allowNull: true
      },
      requerido: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      tableName: 'Campos',
      timestamps: true
    });
  };
  