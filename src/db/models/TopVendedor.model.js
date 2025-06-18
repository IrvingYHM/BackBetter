const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../libs/sequelize");
const Empleado = require("./CrearEmpleado.model"); // Asegúrate de que la ruta es correcta

class TopVendedor extends Model {}

TopVendedor.init(
  {
    idTopVendedor: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    intClvEmpleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Empleado,
        key: "intClvEmpleado",
      },
      onDelete: "CASCADE",
    },
    mes: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    año: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numVentas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "TopVendedor",
    tableName: "tblTopVendedores",
    timestamps: false,
  }
);

// Asociación con Empleado
TopVendedor.belongsTo(Empleado, { foreignKey: "intClvEmpleado", as: "empleado", });

module.exports = TopVendedor;
