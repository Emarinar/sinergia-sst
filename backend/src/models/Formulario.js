// backend/src/models/Formulario.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Formulario', {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'Formularios',
      timestamps: true
    });
  };
  