const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');

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

module.exports = DetallePedido;
