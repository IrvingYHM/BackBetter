// db/models/detallecarrito.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');
const Productos = require ('./producto.model')
const Graduacion = require ('./Detalle_carrito/Graduacion.model')
const Carrito = require ('./Carrito.model')
const Tratamiento = require ('./Detalle_carrito/Tratamiento.model')




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
  IdGraduacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdTratamiento: {
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
DetalleCarrito.belongsTo(Graduacion, { foreignKey: 'IdGraduacion', as: 'graduacion' });
DetalleCarrito.belongsTo(Tratamiento, { foreignKey: 'IdTratamiento', as: 'tratamiento' });
DetalleCarrito.belongsTo(Carrito, { foreignKey: 'IdCarrito', as: 'carrito' });

module.exports = DetalleCarrito;
