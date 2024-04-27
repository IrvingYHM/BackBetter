const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');

class Paqueteria extends Model {}

Paqueteria.init({
  IdPaqueteria: {
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
  modelName: 'Paqueteria',
  tableName: 'tblpaqueteria',
  timestamps: false
});

module.exports = Paqueteria;
