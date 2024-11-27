const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');
//
class Encuesta extends Model {}

Encuesta.init({
  idRespuesta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  modulo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  pregunta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipoPregunta: {
    type: DataTypes.ENUM('Cerrada', 'Abierta'),
    allowNull: true,
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fechaRespuesta: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Realizado'),
    allowNull: false,
    defaultValue: 'Pendiente', // Las encuestas nuevas comienzan en "Pendiente"
  },
}, {
  sequelize,
  modelName: 'Encuesta',
  tableName: 'tblencuestas',
  timestamps: false, // La tabla no tiene createdAt ni updatedAt
});

module.exports = Encuesta;
