const { Model, Datatypes, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize')

const Producto = require('../models/producto.model')


class Valoracion extends Model {}


Valoracion.init({
    IdVaLPro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Comentario: {
        type: DataTypes.STRING(255),
        allowNull:false
    },
    Puntuacion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    IdProducto: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Valoracion',
    tableName: 'tblvaloracion',
    timestamps: false
})

Valoracion.belongsTo(Producto, { foreignKey: 'IdProducto', as: 'producto'})