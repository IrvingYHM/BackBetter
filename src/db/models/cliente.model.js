// db/models/cliente.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class Cliente extends Model {}

Cliente.init({
  intClvCliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  vchNomCliente: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  vchAPaterno: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  vchAMaterno: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  vchCorreo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  chrSexo: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  dtFechaNacimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  vchTelefono: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  vchPassword: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  vchPreguntaSecreta: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  vchRespuestaSecreta: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'Cliente',
  tableName: 'tblclientes',
  timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
});

module.exports = Cliente;
