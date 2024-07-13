// db/models/cita.model.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../libs/sequelize");
const Cliente = require("../cliente.model");
const TipoCita = require("./TipoCita.model");
const EstadoCita = require("./EstadoCita.model");

class Cita extends Model {}

Cita.init(
  {
    IdCita: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    IdCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cliente,
        key: "intClvCliente",
      },
    },
    IdTipoCita: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipoCita,
        key: "IdTipoCita",
      },
    },
    Costo: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    IdEstadoCita: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EstadoCita,
        key: "IdEstadoCita",
      },
    },
    Observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Cita",
    tableName: "tblcita",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["Fecha", "Hora"],
      },
    ],
  }
);

Cita.belongsTo(Cliente, { foreignKey: "IdCliente", as: "cliente" });
Cita.belongsTo(TipoCita, { foreignKey: "IdTipoCita", as: "tipoCita" });
Cita.belongsTo(EstadoCita, { foreignKey: "IdEstadoCita", as: "estadoCita" });

module.exports = Cita;
