// db/models/detallecarrito.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');
const Cliente = require ('./cliente.model');

class Carrito extends Model {}

Carrito.init({
  IdCarrito: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  IdCliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado_pago: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente', // Valores posibles: 'pendiente', 'aprobado', 'denegado', 'cancelado'
  },
}, {
  sequelize,
  modelName: 'Carrito',
  tableName: 'tblcarrito',
  timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
});

Carrito.belongsTo(Cliente, { foreignKey: 'IdCliente', as: 'cliente' });


module.exports = Carrito;
