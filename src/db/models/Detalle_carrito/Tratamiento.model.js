// db/models/detallecarrito.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../libs/sequelize');
/* const Cliente = require ('./cliente.model');
 */
class Tratamiento extends Model {}

Tratamiento.init({
  IdTratamiento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Precio: {
    type: DataTypes.DECIMAL(10, 2), // Campo para el precio, con 10 dígitos en total y 2 decimales
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Tratamiento',
  tableName: 'tbltratamiento',
  timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
});



module.exports = Tratamiento;
