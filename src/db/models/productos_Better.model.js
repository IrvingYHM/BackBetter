const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');
const Categoria = require('./Categoria.model'); // Importa el modelo de Categoria
const Empleado = require('./CrearEmpleado.model');

class Productos_Better extends Model {}

Productos_Better.init(
  {
    IdProducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    IdEmpleado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Empleado, // Asegúrate de que 'Empleado' esté importado correctamente
        key: "intClvEmpleado",
      },
    },
    vchNombreProducto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vchNomImagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    vchDescripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Existencias: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IdCategoria: {
      type: DataTypes.INTEGER,
      allowNull: false, //false para obligatorio
      references: {
        model: Categoria,
        key: "IdCategoria",
      },
    },
    Precio: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false,
    },
    EnOferta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    PrecioOferta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Productos_Better",
    tableName: "tblproductos_better",
    timestamps: false, // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
  }
);

// Define la relación con la tabla Categoria
Productos_Better.belongsTo(Empleado, { foreignKey: 'IdEmpleado', as: 'empleado'});

Productos_Better.belongsTo(Categoria, { foreignKey: 'IdCategoria', as: 'categoria' });

module.exports = Productos_Better;