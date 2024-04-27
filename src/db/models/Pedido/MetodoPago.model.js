const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');

class MetodoPago extends Model {}

MetodoPago.init({
  IdTipoPago: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  TipoPago: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vchDescripcion: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'MetodoPago',
  tableName: 'tblmetodopago',
  timestamps: false
});

module.exports = MetodoPago;