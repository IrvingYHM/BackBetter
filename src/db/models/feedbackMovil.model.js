const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');
//
class EncuestaM extends Model {}

EncuestaM.init({
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
    allowNull: false,
  },
  tipoPregunta: {
    type: DataTypes.ENUM('Cerrada', 'Abierta'),
    allowNull: false,
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fechaRespuesta: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'EncuestaM',
  tableName: 'tblencuestasM',
  timestamps: false, // La tabla no tiene createdAt ni updatedAt
});

module.exports = EncuestaM;