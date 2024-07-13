// db/models/horario.model.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../libs/sequelize");

class Horario extends Model {}

Horario.init(
  {
    IdHorarios: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Dia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Horario",
    tableName: "tblhorarios",
    timestamps: false,
  }
);

module.exports = Horario;
