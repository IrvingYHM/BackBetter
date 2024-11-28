const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class EncuestaM extends Model {}

EncuestaM.init(
  {
    idRespuesta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'idRespuesta', // Mapea la columna `id_encuesta` al atributo `id`
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta1', // Mapea la columna `pregunta_1` al atributo `question1`
    },
    question2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta2', // Mapea la columna `pregunta_2` al atributo `question2`
    },
    question3: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta3', // Mapea la columna `pregunta_3` al atributo `question3`
    },
    question4: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta4', // Mapea la columna `pregunta_4` al atributo `question4`
    },
    question5: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta5', // Mapea la columna `pregunta_5` al atributo `question5`
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "fechaRespuesta", // Mapea la columna `created_at` al atributo `createdAt`
    },
    estado: {
      type: DataTypes.ENUM("Pendiente", "Realizado"),
      allowNull: false,
      defaultValue: "Pendiente", // Las encuestas nuevas comienzan en "Pendiente"
    },
  },
  {
    sequelize,
    modelName: "EncuestaM",
    tableName: "tblencuestasM",
    timestamps: false, // La tabla no tiene createdAt ni updatedAt automáticos
  }
);

module.exports = EncuestaM;
