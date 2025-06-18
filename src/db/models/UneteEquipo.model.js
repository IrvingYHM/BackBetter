const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../libs/sequelize");

class UneteEquipo extends Model {}

UneteEquipo.init(
  {
    IdUnete: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Subtitulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Beneficios: {
      type: DataTypes.TEXT, // Guardaremos la lista como JSON string
      allowNull: false,
    },
    TextoBoton: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "UneteEquipo",
    tableName: "tbluneteequipo",
    timestamps: false,
  }
);

module.exports = UneteEquipo;
