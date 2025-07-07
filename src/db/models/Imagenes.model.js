const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../libs/sequelize");

class Imagenes extends Model {}

Imagenes.init(
  {
    IdImagenes: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UrlDestino: {
      type: DataTypes.STRING,
      allowNull: true, // Puede no tener URL, especialmente en retos o ganadores
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("slider", "retos-ventas", "ganadores-ventas", "retos-afiliados", "ganadores-afiliados"),
      allowNull: false,
      defaultValue: "slider",
    },
  },
  {
    sequelize,
    modelName: "Imagenes",
    tableName: "tblImagenes",
    timestamps: false,
  }
);

module.exports = Imagenes;
