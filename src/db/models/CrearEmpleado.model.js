// db/models/cliente.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class Empleado extends Model {}

Empleado.init(
  {
    intClvEmpleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    vchNombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vchAPaterno: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vchAMaterno: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vchCorreo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dtFechaNacimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    vchLugarNacimiento: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vchTelefono: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    chrSexo: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    vchPassword: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    vchPreguntaSecreta: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    vchRespuestaSecreta: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    EstadoEmp: {
      type: DataTypes.ENUM("Aceptado", "Rechazado", "En espera", "Desactivado"),
      allowNull: true,
      defaultValue: "En espera",
    },
    TipoEmp: {
      type: DataTypes.ENUM("Administrador", "Asociado"),
      allowNull: true,
      defaultValue: "Asociado",
    },
  },
  {
    sequelize,
    modelName: "Empleado",
    tableName: "tblempleado",
    timestamps: false, // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
  }
);

module.exports = Empleado;
