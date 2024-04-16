const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');
/* const Cliente = require('../cliente.model');
const MetodoPago = require('./MetodoPago.model');
const EstadoPedido = require('./EstadoPedido.model');
const EstadoEnvio = require('./EstadoEnvio.model');
const DireccionCliente = require('../Direc_Client.model');
const Paqueteria = require('./Paqueteria.model');
const Empleado = require('../CrearEmpleado.model'); */

class Pedido extends Model {}

Pedido.init({
  IdPedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  Fecha_Hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  IdCliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Numero_Guia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  TotalPe: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  IdMetodoPago: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdEstado_Pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdEstado_Envio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdDireccion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdPaqueteria: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Pedido',
  tableName: 'tblpedido',
  timestamps: false
});
/* 
Pedido.belongsTo(Cliente, { foreignKey: 'IdCliente', as: 'cliente' });
Pedido.belongsTo(MetodoPago, { foreignKey: 'IdMetodoPago', as: 'metodoPago' });
Pedido.belongsTo(EstadoPedido, { foreignKey: 'IdEstado_Pedido', as: 'estadoPedido' });
Pedido.belongsTo(EstadoEnvio, { foreignKey: 'IdEstado_Envio', as: 'estadoEnvio' });
Pedido.belongsTo(DireccionCliente, { foreignKey: 'IdDireccion', as: 'direccionCliente' });
Pedido.belongsTo(Paqueteria, { foreignKey: 'IdPaqueteria', as: 'paqueteria' });
Pedido.belongsTo(Empleado, { foreignKey: 'IdEmpleado', as: 'empleado' }); */

module.exports = Pedido;