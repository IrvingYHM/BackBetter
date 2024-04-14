const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');
const Categoria = require('./Categoria.model'); // Importa el modelo de Categoria
const Marca = require('./Marca.model'); // Importa el modelo de Marca
/* const Graduacion = require('./Graduacion.model'); // Importa el modelo de Graduacion */

class Productos extends Model {}

Productos.init({
    IdProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, 
    autoIncrement: true
  },
  IdEmpleado: {
    type: DataTypes.STRING(250), 
    allowNull: true
  },
  vchNombreProducto: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  vchNomImagen: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  vchDescripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Existencias: {
    type: DataTypes.FLOAT, 
    allowNull: true
  },
  IdCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria,
      key: 'IdCategoria'
    }
  },
  IdMarca: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Marca,
      key: 'IdMarca'
    }
    
  },
  Precio: {
    type: DataTypes.DECIMAL(10, 0), 
    allowNull: true
  },

/*   IdGraduacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Graduacion,
      key: 'IdGraduacion'
    }
  }, */
}, {
  sequelize,
  modelName: 'Productos',
  tableName: 'tblproductos',
  timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
});

// Define la relación con la tabla Categoria
Productos.belongsTo(Categoria, { foreignKey: 'IdCategoria', as: 'categoria' });

Productos.belongsTo(Marca, { foreignKey: 'IdMarca', as: 'marca' });

/* Productos.belongsTo(Graduacion, { foreignKey: 'IdGraduacion', as: 'graduacion' }); */

module.exports = Productos;