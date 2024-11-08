const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const Suscripcion = sequelize.define('Suscripcion', {
  // Definir el nombre correcto de la columna en la base de datos
  IdSuscripcion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Auto incremento para el id
    field: 'IdSuscripcion' // Mapeo de nombre de columna en la base de datos
  },
  Endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'ENDPOINT' // Mapeo de nombre de columna en la base de datos
  },
  Keys: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'Keys' // Mapeo de nombre de columna en la base de datos
  },
  Auth: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'default_auth_key', // Agrega un valor por defecto
    field: 'Auth' // Mapeo de nombre de columna en la base de datos
  },
  FechaSuscripcion: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'FechaSuscripcion' // Mapeo de nombre de columna en la base de datos
  },
  Estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo',
    field: 'Estado' // Mapeo de nombre de columna en la base de datos
  }
}, {
  tableName: 'tblsuscripciones', // Asegúrate de que el nombre de la tabla sea correcto
  timestamps: false // Si no usas campos `createdAt` y `updatedAt`
});

module.exports = Suscripcion;
