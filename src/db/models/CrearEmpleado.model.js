// db/models/cliente.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class Empleado extends Model {}

Empleado.init({
  intClvEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  vchNombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  vchAPaterno: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  vchAMaterno: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  vchCorreo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dtFechaNacimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  vchTelefono: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  chrSexo: {
    type: DataTypes.CHAR(1),
    allowNull: false
  },
  EstadoEmp: {
    type: DataTypes.ENUM('DISPONIBLE', 'OCUPADO', 'NO DISPONIBLE'),
    allowNull: true
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
  modelName: 'Empleado',
  tableName: 'tblempleado',
  timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
});

module.exports = Empleado;
