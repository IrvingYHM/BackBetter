const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');

class EstadoPedido extends Model {}

EstadoPedido.init({
  IdEstado_Pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'EstadoPedido',
  tableName: 'tblEstado_Pedido',
  timestamps: false
});

module.exports = EstadoPedido; 