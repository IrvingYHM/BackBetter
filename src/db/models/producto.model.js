// db/models/cliente.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class Productos extends Model {}

Productos.init({
    IdProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  vchNombreProducto: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  vchNomImagen: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  vchDescripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Existencia: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Precio: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'Productos',
  tableName: 'tblproductos',
  timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
});

module.exports = Productos;
