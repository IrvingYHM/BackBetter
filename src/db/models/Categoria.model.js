const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class Categoria extends Model {}

Categoria.init({
    IdCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  NombreCategoria: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Categoria',
  tableName: 'tblcategorias',
  timestamps: false
});

module.exports = Categoria;
