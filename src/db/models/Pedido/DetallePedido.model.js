const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../libs/sequelize");
const Pedido = require("../Pedido/Pedido.model");

class DetallePedido extends Model {}

DetallePedido.init(
  {
    IdDetallePedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    NombreProducto: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nombre del producto en el momento de la venta",
    },
    PrecioUnitario: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: "Precio por unidad en el momento de la venta",
    },
    Cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SubTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: "Cantidad * PrecioUnitario",
    },
    IdPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DetallePedido",
    tableName: "tbldetalle_pedido",
    timestamps: false,
  }
);

// Relación con Pedido
DetallePedido.belongsTo(Pedido, { foreignKey: "IdPedido", as: "Pedido" });

module.exports = DetallePedido;
