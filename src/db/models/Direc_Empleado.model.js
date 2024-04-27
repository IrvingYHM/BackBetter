const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');
const Empleado = require('../models/CrearEmpleado.model');

class Direc_Empleado extends Model{}

Direc_Empleado.init (
    {
        IdDirec_Emp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        Estado: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        Municipio: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        Colonia:{
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        Calle: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        CP: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        IdEmpleado: {
            type: DataTypes.INTEGER,
            allowNull: false
        }  
    },

    {
        sequelize,
        modelName: "Direc_Empleado",
        tableName: "tblDirec_Emp",
        timestamps: false
    }
);

Direc_Empleado.belongsTo(Empleado, { foreignKey: 'IdEmpleado', as: 'empleado'});
module.exports = Direc_Empleado;