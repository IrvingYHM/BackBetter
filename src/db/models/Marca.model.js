const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class Marca extends Model {}

Marca.init({
    IdMarca: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  NombreMarca: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Marca',
  tableName: 'tblmarcas',
  timestamps: false
});

module.exports = Marca;
