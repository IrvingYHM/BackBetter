// db/models/codigo_recuperacion.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class CodigoRecuperacion extends Model {}

CodigoRecuperacion.init({
  IdCodigoRecuperacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  Codigo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  HoraExpiracion: {
    type: DataTypes.TIME,
    allowNull: false
  },
  Correo_electronico: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'CodigoRecuperacion',
  tableName: 'tblcodigos_recuperacion',
  timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
});

module.exports = CodigoRecuperacion;
