const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../libs/sequelize");
const Empleado = require("./CrearEmpleado.model"); // Asegúrate de que la ruta es correcta

class TopReferidos extends Model {}

TopReferidos.init(
  {
    idTopReferidos: {
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
    numReferidos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "TopReferidos",
    tableName: "tblTopReferidos",
    timestamps: false,
  }
);

// Asociación con Empleado
TopReferidos.belongsTo(Empleado, { foreignKey: "intClvEmpleado", as: "empleado", });

module.exports = TopReferidos;
