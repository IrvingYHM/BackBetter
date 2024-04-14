// db/models/direccion_cliente.model.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../libs/sequelize");

class Direc_Client extends Model {}

Direc_Client.init(
  {
    IdDirec_Client: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    CP: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    Municipio: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Colonia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Calle: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    NumExt: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    NumInt: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Referencia: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    IdCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Direc_Client",
    tableName: "tbldirec_client",
    timestamps: false, // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
  }
);

module.exports = Direc_Client;
