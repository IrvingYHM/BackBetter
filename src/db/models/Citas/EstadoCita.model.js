// db/models/estado_cita.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');


class EstadoCita extends Model {}

EstadoCita.init({
  IdEstadoCita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'EstadoCita',
  tableName: 'tblestado_cita',
  timestamps: false
});

module.exports = EstadoCita;
