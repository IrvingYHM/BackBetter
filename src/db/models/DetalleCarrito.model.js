// db/models/detallecarrito.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');
const Productos = require ('./producto.model')
const Carrito = require ('./Carrito.model')




class DetalleCarrito extends Model {}

DetalleCarrito.init({
  IdDetalle_Carrito: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  IdProducto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  Descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  SubTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  Cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdCarrito: {
    type: DataTypes.INTEGER,
    allowNull: false 
  },
}, {
  sequelize,
  modelName: 'DetalleCarrito',
  tableName: 'tbldetallecarrito',
  timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
});

DetalleCarrito.belongsTo(Productos, { foreignKey: 'IdProducto', as: 'producto' });
DetalleCarrito.belongsTo(Carrito, { foreignKey: 'IdCarrito', as: 'carrito' });

module.exports = DetalleCarrito;
