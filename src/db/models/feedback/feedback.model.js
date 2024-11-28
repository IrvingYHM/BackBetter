const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../libs/sequelize");

class Encuesta extends Model {}

Encuesta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_encuesta', // Mapea la columna `id_encuesta` al atributo `id`
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta_1', // Mapea la columna `pregunta_1` al atributo `question1`
    },
    question2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta_2', // Mapea la columna `pregunta_2` al atributo `question2`
    },
    question3: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta_3', // Mapea la columna `pregunta_3` al atributo `question3`
    },
    question4: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta_4', // Mapea la columna `pregunta_4` al atributo `question4`
    },
    question5: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregunta_5', // Mapea la columna `pregunta_5` al atributo `question5`
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at", // Mapea la columna `created_at` al atributo `createdAt`
    },
    estado: {
      type: DataTypes.ENUM("Pendiente", "Realizado"),
      allowNull: false,
      defaultValue: "Pendiente", // Las encuestas nuevas comienzan en "Pendiente"
    },
  },
  {
    sequelize,
    modelName: "Encuesta",
    tableName: "tblencuestasWeb",
    timestamps: false, // La tabla no tiene createdAt ni updatedAt automáticos
  }
);

module.exports = Encuesta;
