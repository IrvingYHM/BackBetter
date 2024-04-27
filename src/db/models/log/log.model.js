const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');

class Log extends Model {}

Log.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ip: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  codigo_estado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
    Accion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

}, {
  sequelize,
  modelName: 'Log',
  tableName: 'log',
  timestamps: false
});

module.exports = Log;
