const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class EstadoPedido extends Model {}

EstadoPedido.init({
  IdEstado_Pedido: {
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
  modelName: 'EstadoPedido',
  tableName: 'tblestado_pedido',
  timestamps: false
});

module.exports = EstadoPedido;