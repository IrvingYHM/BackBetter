const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');

class EstadoEnvio extends Model {}

EstadoEnvio.init({
  IdEstado_Envio: {
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
  modelName: 'EstadoEnvio',
  tableName: 'tblEstado_Envio',
  timestamps: false
});

module.exports = EstadoEnvio;