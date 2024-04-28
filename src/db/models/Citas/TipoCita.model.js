// db/models/tipo_cita.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');

class TipoCita extends Model {}

TipoCita.init({
  IdTipoCita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Costo: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'TipoCita',
  tableName: 'tbltipo_cita',
  timestamps: false
});

module.exports = TipoCita;
