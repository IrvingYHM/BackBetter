const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');
const Graduacion = require('../Detalle_carrito/Graduacion.model')
const Pedido = require('../Pedido/Pedido.model')
const Tratamiento = require('../Detalle_carrito/Tratamiento.model');
const Producto = require('../producto.model');


class DetallePedido extends Model {}

DetallePedido.init({
  IdDetallePedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  IdProducto: {
    type: DataTypes.INTEGER,
    allowNull: true
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
    type: DataTypes.STRING,
    allowNull: true
  },
  SubTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  Cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdPedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'DetallePedido',
  tableName: 'tbldetalle_pedido',
  timestamps: false
});

DetallePedido.belongsTo(Graduacion,{ foreignKey: 'IdGraduacion', as: 'Graduacion'});
DetallePedido.belongsTo(Pedido, { foreignKey: 'IdPedido', as: 'Pedido'});
DetallePedido.belongsTo(Tratamiento, { foreignKey: 'IdTratamiento', as: 'Tratamiento'});
DetallePedido.belongsTo(Producto, { foreignKey: 'IdProducto', as: 'Producto'});

module.exports = DetallePedido;
