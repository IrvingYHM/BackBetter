const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class Graduacion extends Model {}

Graduacion.init({
    IdGraduacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ValorGraduacion: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Graduacion',
  tableName: 'tblgraduaciones',
  timestamps: false
});

module.exports = Graduacion;
